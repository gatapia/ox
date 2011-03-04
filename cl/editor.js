
goog.provide('ox.cl.editor');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.style');
goog.require('goog.Timer');

goog.require('ox.cl.ansiesc');

/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ox.cl.editor = function(parent) {
  goog.events.EventTarget.call(this);

  this.parent_ = parent;
  this.lines_ = [];
  this.buffer_ = [];
  this.input_;
  this.inputContainer_;
  this.commandBuffer_ = [];
  this.commandBufferIdx_ = 0;
  this.buildInput_();
  this.render_();
  this.unFocus_();
};
goog.inherits(ox.cl.editor, goog.events.EventTarget);

ox.cl.editor.MAX_BUFFER = 200;


ox.cl.editor.prototype.resize = function() {
  var s = goog.dom.getViewportSize();
  s.width -= 20;
  s.height -= 20;
  goog.style.setSize(this.parent_, s);
};

ox.cl.editor.prototype.write = function(data, command) {
  if (!data) data = '';
  data = data.split('\n');
  goog.array.forEach(data, function(l) {
    this.writeLine_(l, command);
  }, this);
}


ox.cl.editor.prototype.writeLine_ = function(line, command) {
  if (this.buffer_.length === ox.cl.editor.MAX_BUFFER) { this.buffer_.shift(); };
  var prompt = command ? '> ' : '';
  var txt = command ? line : ox.cl.ansiesc.parse(line);
  this.buffer_.push(prompt + txt);
  this.render_();
};

ox.cl.editor.prototype.setEnabled = function(enabled) {
  if (enabled === false) {
    this.input_.setAttribute('disabled', 'disabled');
  } else {
    this.input_.removeAttribute('disabled');
  }
};

ox.cl.editor.prototype.buildInput_ = function() {
  this.input_ = goog.dom.createDom('input',
    {'type':'text','class':'cmd-input'});
  goog.events.listen(this.input_, 'keyup', this.keyUp_, false, this);
  goog.events.listen(this.input_, 'blur', this.unFocus_, false, this);

  this.inputContainer_ = this.buildInputContainer_();
};


ox.cl.editor.prototype.buildInputContainer_ = function() {
  return goog.dom.createDom('div', {'class':'input-container'},
        goog.dom.createDom('span', {'class':'prompt'}, '>'),
        this.input_);
};


ox.cl.editor.prototype.unFocus_ = function() {
  goog.Timer.callOnce(function() {
    this.input_.focus();
  }, 0, this);
};

ox.cl.editor.prototype.keyUp_ = function(e) {
  var txt = this.input_.value;
  var kc = e.keyCode;
  if (kc === 13) {
    this.handleCommand_(txt);
  } else if (kc === 38) { // up
    if (this.commandBufferIdx_ > 0) {
      var cmd = this.commandBuffer_[--this.commandBufferIdx_];
      this.input_.value = cmd;
    }
  } else if (kc === 40) { // down
    if (this.commandBufferIdx_ < this.commandBuffer_.length - 1) {
      var cmd = this.commandBuffer_[++this.commandBufferIdx_];
      this.input_.value = cmd;
    }
  };
};

ox.cl.editor.prototype.handleCommand_ = function(txt) {
  if (this.handleSpecialCommand_(txt)) return;

  this.write(txt, true);
  this.commandBuffer_.push(txt);
  this.commandBufferIdx_ = this.commandBuffer_.length;
  var event = new goog.events.Event('data');
  event['data'] = txt + '\n';
  this.dispatchEvent(event);
}

ox.cl.editor.prototype.handleSpecialCommand_ = function(txt) {
  var special = txt === 'clear' || txt === 'reset';
  if (!special) return false;
  this.buffer_ = [];
  this.lines_ = [];
  goog.dom.removeChildren(this.parent_);
  this.render_();
  return true;
};

ox.cl.editor.prototype.render_ = function() {
  this.input_.value = '';
  for (var i = 0, len = this.buffer_.length; i < len; i++) {
    var div = this.lines_[i];
    if (!div) {
      div = this.lines_[i] = goog.dom.createElement('div');
      goog.dom.appendChild(this.parent_, div);
    };
    div.innerHTML = this.buffer_[i];//.replace(/ /g, '&nbsp;');
  };
  goog.dom.appendChild(this.parent_, this.inputContainer_);
};