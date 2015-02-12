/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var prefs = require('sdk/simple-prefs');

// var app = require('sdk/system/xul-app');
var formatListener = function () {
  console.log("Format changed to " + prefs.prefs.format);
};

exports.main = function () {
  prefs.on('format', formatListener);
  formatListener();
};

exports.onUnload = function () {
  prefs.removeListener('format', formatListener);
};
