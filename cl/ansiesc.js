
goog.provide('ox.cl.ansiesc');

/**
 * @fileOverview
 */

/**
 * @param {string} txt The text that can contain some ascii sequences
 * @return {string} The styled html
 */
ox.cl.ansiesc.parse = function(txt) {
  // var cols = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
  var cols = ['#000', '#c66', '#6c6', '#cc6', '#6cc', '#c6c', '#6c9', '#ccc'];
  txt = txt.replace(/\x1B\[0m\x1B\[01;3(\d)m(.*)\x1B\[0m/g, '<span style="color:$1">$2</span>');
  txt = txt.replace(/\x1B\[01;3(\d)m(.*)\x1B\[0m/g, '<span style="color:$1">$2</span>');
  var idx = txt.indexOf('color:');
  if (idx >= 0) {
    var colid = txt.substring(idx + 6, idx + 7);
    var col = parseInt(colid, 10);
    txt = txt.replace('color:' + col, 'color:' + cols[col]);
  };
  txt = txt.replace(/\x1B\[1m(.*?)(\x1B\[0m)/g, '<b>$1</b>$2');
  return txt;
}