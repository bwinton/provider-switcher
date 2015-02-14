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

    let oneoffheader = document.getAnonymousElementByAttribute(popup, 'anonid', 'search-panel-one-offs-header');
    oneoffheader.style.display = 'none';

    let oneoffs = document.getAnonymousElementByAttribute(popup, 'anonid', 'search-panel-one-offs');
    oneoffs.style.display = 'none';

    let header = document.getAnonymousElementByAttribute(popup, 'anonid', 'searchbar-engine');
    for (var item of header.childNodes) {
      item.style.display = 'none';
    }

    let providers = document.createElement('div');
    providers.textContent = 'Header content!';
    header.insertBefore(providers, header.childNodes[0]);
  }
};

exports.main = function () {
  prefs.on('format', formatListener);
  formatListener();
};

exports.onUnload = function () {
  prefs.removeListener('format', formatListener);
};
