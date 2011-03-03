
goog.provide('ox.cl.ox');
goog.require('ox.cl.editor');

/**
 * @constructor
 */
ox.cl.ox = function() {
  this.socket_ = this.initSocket_();
  this.editor_ = this.initEditor_();
  goog.events.listen(this.editor_, 'data', this.sendCommand_, false, this);
  goog.events.listen(window, 'resize',
    goog.bind(this.editor_.resize, this.editor_), false, this);
  this.editor_.resize();
};

ox.cl.ox.prototype.initSocket_ = function() {
  console.log('creating socket: ' + document.location.href);
  var s = new io.Socket(null, null, {port: 8124, rememberTransport: false});

  s.connect();
  console.log('called connect();');
  s.on('connect', goog.bind(function(msg) {
    this.editor_.write('connected...');
  }, this));
  s.on('message', goog.bind(function(msg) {
    this.editor_.write(msg.data);
  }, this));
  s.on('disconnect', function() {
    this.editor_.write('disconnected...');
    this.editor_.setEnabled(false);
  });
  // s.send('ls --color -la\n');
  return s;
};


ox.cl.ox.prototype.initEditor_ = function() {
  return new ox.cl.editor(goog.dom.getElement('terminal'));
};

ox.cl.ox.prototype.sendCommand_ = function(e) {
  this.socket_.send(e.data);
};