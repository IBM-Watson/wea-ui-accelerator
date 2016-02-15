/* Copyright IBM Corp. 2015, 2016
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  var isTopWindow = function () {
    try {
      return window.self === window.top;
    }
    catch (e) {
      return false;
    }
  };

  /**
   * WEA Accelerator App enables users to interact with
   * a Watson Experience Manager instance using the conversation API.
   * Its appearance can be customized and it can be configured to use
   * a client-specific Experience Manager endpoint.
   */
  angular.module('app', [
    'gettext',
    'ngRoute',
    'ui.scrollfix',
    'watson.avatar',
    'templates',
    'dialog',
    'intro',
    'styleguide',
    'examples'
  ])
    .constant('CONFIG', {
      // @ifdef WEA_API_URL
      'WEA_API_URL': '/* @echo WEA_API_URL */',
      // @endif
      // @ifdef WEA_API_TOKEN
      'WEA_API_TOKEN': '/* @echo WEA_API_TOKEN */',
      // @endif
      // @ifdef WDS_API_URL
      'WDS_API_URL': '/* @echo WDS_API_URL */',
      // @endif
      // @ifdef WDS_APP_ID
      'WDS_APP_ID': '/* @echo WDS_APP_ID */',
      // @endif
      'EMBEDDED': !isTopWindow()
    })
    .config(function ($routeProvider) {
      $routeProvider.otherwise({ 'redirectTo': '/' });
    })
    .run(function ($rootScope, CONFIG, gettextCatalog) {
      $rootScope.embedded = CONFIG.EMBEDDED;
      gettextCatalog.setCurrentLanguage('en_US');
      gettextCatalog.debug = true;
    });
}());
