
goog.provide('ox.srv.httpSrv');

goog.require('node.fs');
goog.require('node.path');
goog.require('goog.array');
goog.require('goog.string');

/**
 * @constructor
 */
ox.srv.httpSrv = function() {
  this.http = node.http.createServer(goog.bind(this.req_, this));
  this.fileCache_ = {};
  this.contentTypes_ = {};
  this.start_();
};

ox.srv.httpSrv.USE_CLIENT_CACHE_ = false;

ox.srv.httpSrv.prototype.start_ = function() {
  this.http.listen(8124);
  console.log('XTerm running at http://127.0.0.1:8124/');
};

/**
 * @private
 */
ox.srv.httpSrv.prototype.req_ = function(req, res) {
  var contents = this.getUrlContents_(req.url);

  if (!contents) {
    // console.log('could not find "' + req.url + '"');
    res.writeHead(404);
    res.end();
  } else {
    // console.log('serving file "' + req.url + '"');
    var key = this.getPathKey_(req.url);
    res.writeHead(200, {'Content-Type': this.contentTypes_[key]});
    res.end(contents);
  }
};

ox.srv.httpSrv.prototype.getUrlContents_ = function(url) {
  var key = this.getPathKey_(url);
  // Let socket.io serve its own files
  if (key === 'socket.io.js') return null;
  var isGoog = key.indexOf('goog/') >= 0;
  var path = !isGoog ?
    'cl/' + key :
    '../nclosure/third_party/closure-library/closure/' + key;
  return this.getContentsImpl_(path, isGoog);
};

ox.srv.httpSrv.prototype.getContentsImpl_ = function(path, forceCache) {
  var key = this.getPathKey_(path);
  if (this.fileCache_[key]) return this.fileCache_[key];
  if (!node.path.existsSync(path)) { return null; }

  var contents = node.fs.readFileSync(path);
  this.contentTypes_[key] = this.getContentType_(key.split('.').pop());

  if (!forceCache && !ox.srv.httpSrv.USE_CLIENT_CACHE_) return contents;

  return this.fileCache_[key] = contents;
};

ox.srv.httpSrv.prototype.getPathKey_ = function(path) {
  if (goog.string.endsWith(path, '/')) { path += 'index.html'; }
  var gidx = path.indexOf('goog/');
  return gidx > 0 ? path.substring(gidx) : path.split('/').pop();
};

ox.srv.httpSrv.prototype.getContentType_ = function(ext) {
  switch (ext) {
    case 'js': return 'application/x-javascript';
    case 'css': return 'text/css';
    case 'html': return 'text/html';
    default:
      throw new Error('Could not find the content type for extension: ' + ext);
  }
};
