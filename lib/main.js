/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

let prefs = require('sdk/simple-prefs');
let self = require('sdk/self');
let winutils = require('sdk/window/utils');
let xulcss = require('./xulcss');

const kXULNS = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';
const CUSTOM_CSS = self.data.url('searchicons.css');

let loaded = false;

// let app = require('sdk/system/xul-app');
let formatListener = function () {
  console.log('Format changed to ' + prefs.prefs.format);
  if (prefs.prefs.format === 0) {
    let window = winutils.getMostRecentBrowserWindow();
    let document = window.document;
    let searchbar = document.getElementById('searchbar');
    let popup = document.getElementById('PopupSearchAutoComplete');
    popup.setAttribute('noautohide', true);
    let getPopupElement = document.getAnonymousElementByAttribute.bind(document, popup, 'anonid');

    let oneoffheader = getPopupElement('search-panel-one-offs-header');
    oneoffheader.style.display = 'none';

    let oneoffs = getPopupElement('search-panel-one-offs');
    oneoffs.style.display = 'none';

    let header = getPopupElement('searchbar-engine');
    for (let item of header.childNodes) {
      item.style.display = 'none';
    }

    let providers = document.createElement('div');
    providers.setAttribute('class', 'custom engine-container');
    header.insertBefore(providers, header.childNodes[0]);

    // console.log(searchbar.currentEngine);
    for (let engine of searchbar.engines) {
      let button = document.createElementNS(kXULNS, 'image');
      button.setAttribute('label', engine.name);
      button.setAttribute('tooltiptext', engine.name);
      button.setAttribute('class', 'custom searchbar-engine-image');
      if (engine === searchbar.currentEngine) {
        button.setAttribute('selected', 'true');
        console.log('Selected ', engine.name);
      }
      if (engine.iconURI) {
        button.setAttribute('src', engine.iconURI.spec);
      }
      providers.appendChild(button);
      button.engine = engine;
    }

//anonid = searchbar-textbox
    document.getElementById('searchbar').addEventListener('keypress', e => {
      switch (e.key) {
      case 'ArrowRight':
      case 'ArrowLeft':
        console.log('BW', e.key, e.keyCode);
        e.returnValue = false;
        e.cancelBubble=true;
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
      return true;
    });

  }
};

exports.main = function () {
  if (!loaded) {
    loaded = xulcss.addXULStylesheet(CUSTOM_CSS);
  }

  prefs.on('format', formatListener);
  formatListener();
};

exports.onUnload = function () {
  if (loaded) {
    loaded = xulcss.removeXULStylesheet(CUSTOM_CSS);
  }

  prefs.removeListener('format', formatListener);
};
