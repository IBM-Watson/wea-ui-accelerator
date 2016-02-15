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

  angular.module('quit', ['dialog.service'])

    /**
     * @name quit
     * @module quit
     * @description
     *
     * Displays the quit icon and, when user clicks on the icon,
     * an overlay containing Quit / Cancel buttons.
     *
     * @see {@link ../dialog/dialog.html} for a usage example.
     */
    .directive('weaQuit', function ($window, $location, dialogService, CONFIG) {
      return {
        'restrict': 'E',
        'templateUrl': CONFIG.EMBEDDED ? 'modules/quit/quit_embedded.html' : 'modules/quit/quit.html',
        'link': function (scope) {
          var returnTo = $location.search().returnTo || 'wea:///';

          /**
           * Extracts the path part of an in-app url.
           * In-app urls can be used to represent locations inside the
           * application. For example `wea:///examples/flexrate` references
           * the /examples/flexrate route **inside** the application, whereas
           * plain `/examples/flexrate` references a location relative to
           * web server root.
           *
           * @param  {string} url - an URL.
           * @return {string | null} the path inside the application, or `null` if the url is not an in-app url.
           */
          var parseInAppUrl = function (url) {
            return url && url.substring(0, 6) === 'wea://'
                   ? url.substring(6)
                   : null;
          };

          scope.quitting = false;

          scope.quit = function () {
            scope.quitting = true;
            scope.$emit('wea.quittingStarted');
          };

          scope.cancel = function () {
            scope.quitting = false;
            scope.$emit('wea.quittingCanceled');
          };

          scope.confirm = function () {
            var inAppReturnUrl = parseInAppUrl(returnTo);
            dialogService.end()
              .then(function () {
                scope.$emit('wea.quittingDone');
                scope.quitting = false;
                if (inAppReturnUrl) {
                  $location.url(inAppReturnUrl);
                }
                else {
                  $window.location.href = returnTo;
                }
              });
          };
        }
      };
    });
}());
