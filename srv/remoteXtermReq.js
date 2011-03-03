
goog.provide('ox.srv.remoteXtermReq');

goog.require('node.child_process');

/**
 * @constructor
 */
ox.srv.remoteXtermReq = function(client) {
  /**
   * @private
   */
  this.client_ = client;

  /**
   * @private
   */
  this.xterm_;

  this.init_();
};

/**
 * @private
 */
ox.srv.remoteXtermReq.prototype.init_ = function() {
  this.initXTerm_();

  this.client_.on('message', goog.bind(this.onMessage_, this));
  this.client_.on('disconnect', goog.bind(this.onDisconnect_, this));
};

/**
 * @private
 */
ox.srv.remoteXtermReq.prototype.onMessage_ = function (msg) {
  console.log('> ' + msg);
  this.xterm_.stdin.write(msg);
};

/**
 * @private
 */
ox.srv.remoteXtermReq.prototype.onDisconnect_ = function () {
  this.client_ = null;
  this.xterm_.kill('SIGHUP');
};

/**
 * @private
 */
ox.srv.remoteXtermReq.prototype.initXTerm_ = function() {
  this.xterm_ = require('child_process').spawn('sh', []);
  console.log('this.xterm_ SPAWNED');

  var out = goog.bind(this.sendDataToClient_, this);
  this.xterm_.stdout.on('data', out);
  this.xterm_.stderr.on('data', out);

  this.xterm_.on('exit', function(code) {
    if (this.client_) { this.client_.disconnect(); }
  });
  console.log('initXTerm_ done');
};

ox.srv.remoteXtermReq.prototype.sendDataToClient_ = function(data) {
  var msg = data.toString();
  console.log('=' + msg);
  this.client_.send({'data':msg});
};