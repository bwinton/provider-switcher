/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

let prefs = require('sdk/simple-prefs');
let winutils = require('sdk/window/utils');

// let app = require('sdk/system/xul-app');
let formatListener = function () {

  console.log('Format changed to ' + prefs.prefs.format);
  if (prefs.prefs.format === 0) {
    let window = winutils.getMostRecentBrowserWindow();
    let document = window.document;
    let popup = document.getElementById('PopupSearchAutoComplete');
    let header = document.getAnonymousElementByAttribute(popup, 'anonid', 'search-panel-one-offs-header');
    header.style.display = 'none';
    let oneoffs = document.getAnonymousElementByAttribute(popup, 'anonid', 'search-panel-one-offs');
    oneoffs.style.display = 'none';
  }
};

exports.main = function () {
  prefs.on('format', formatListener);
  formatListener();
};

exports.onUnload = function () {
  prefs.removeListener('format', formatListener);
};
