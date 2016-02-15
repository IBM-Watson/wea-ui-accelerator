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

  angular.module('styleguide.example', [ 'dialog.response', 'watson.avatar' ])
    /**
     * @name styleguideExample
     * @module styleguide
     * @description
     *
     * Displays an editable example response.
     *
     * @see {@link styleguide.html} for a usage example.
     */
    .directive('styleguideExample', function () {
      return {
        'restrict': 'E',
        'templateUrl': 'modules/styleguide/styleguide-example.html',
        'scope': {
          'model': '='
        },
        'link': function (scope) {
          scope.buildResponse = function (text) {
            return {
              'responses': [
                { 'text': text }
              ]
            };
          };
        }
      };
    });
}());
