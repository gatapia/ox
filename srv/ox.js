#!/usr/local/bin/node

require('nclosure').nclosure();

goog.provide('ox.srv.ox');

goog.require('ox.srv.remoteXtermReq');
goog.require('ox.srv.httpSrv');

goog.require('node.http');


node.io =
  /** @type {{listen:function(node.http):{on:function(string,Function)}}} */
  (require('socket.io'));

/**
 * All ox classes live in the ox namespace
 * @name ox
 * @namespace
 */

/**
 * @fileoverview OX
 * @author Guido Tapia
 */

/**
 * @constructor
 */
ox.srv.ox = function() {
  var s = new ox.srv.httpSrv();
  var socket = node.io.listen(s.http);
  socket.on('connection', goog.bind(this.onReq_, this))
};

/**
 * @private
 */
ox.srv.ox.prototype.onReq_ = function(client) {
  new ox.srv.remoteXtermReq(client);
};

new ox.srv.ox(); // Go!