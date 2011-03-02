#!/usr/local/bin/node

require('nclosure').nclosure();

goog.provide('ox.ox');

goog.require('ox.remoteXtermReq');

goog.require('node.fs');
goog.require('node.path');
goog.require('node.http');
goog.require('node.child_process');

/**
 * All ox classes live in the ox namespace
 * @name ox
 * @namespace
 */

/**
 * @fileOverview OX command
 * @author Guido Tapia
 */

/**
 * @constructor
 */
ox.ox = function() {

  var server = node.http.createServer(goog.bind(this.onReq_, this));
  server.listen(8124);

  console.log('XTerm running at http://127.0.0.1:8124/');
};

/**
 * @private
 */
ox.ox.prototype.onReq_ = function(req, res) {
  new ox.remoteXtermReq(req, res);
};

new ox.ox(); // Go!