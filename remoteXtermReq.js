
goog.provide('ox.remoteXtermReq');

goog.require('node.child_process');

ox.remoteXtermReq = function(req, res) {
  this.req = req;
  this.res = res;
  this.xterm_;
  this.init_();
};

/**
 * TODO: This should use web sockets not http
 * @private
 */
ox.remoteXtermReq.prototype.init_ = function() {
  this.initXTerm_();

  var that = this;
  this.req.on('data', function(data) {
    console.log('> ' + data);
    that.xterm_.stdin.write(data);
  });
  setTimeout(function() {
    var cmd = 'ls\n';
    console.log('> ' + cmd);
    that.xterm_.stdin.write(cmd);
  }, 1000);
  this.res.writeHead(200, {
    'Transfer-Encoding': 'chunked',
    'Content-Type': 'text/plain' });
};

/**
 * @private
 */
ox.remoteXtermReq.prototype.initXTerm_ = function() {
  this.xterm_ = require('child_process').spawn('sh', []);
  console.log('this.xterm_ SPAWNED');

  var that = this;
  var out = function(d) {
    console.log('out: ' + d);
    that.res.write(d);
  };
  this.xterm_.stdout.on('data', out);
  this.xterm_.stderr.on('data', out);

  this.xterm_.on('exit', function(code) {
    this.res.end('exit: ' + code);
  });
  console.log('initXTerm_ done');
};