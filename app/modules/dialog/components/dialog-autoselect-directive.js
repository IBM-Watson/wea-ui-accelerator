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

  angular.module('dialog.component.autoselect', ['dialog.service'])

    /**
     * @name autoselect
     * @module dialog/component/autoselect
     * @description
     *
     * Displays a dropdown selector that submits the selected value to the dialogService.
     */
    .directive('autoselect', function (dialogService) {
      return {
        'restrict': 'E',
        'template': '<select ng-model="selection" ng-options="option for option in options">' +
                    '  <option value="">Select</option>' +
                    '</select>' +
                    '<button wea-max-clicks="1">Confirm</button>',
        'scope': true,
        'link': function (scope, element, attr) {
          var button = element.find('button');
          var submit = function () {
            if (scope.selection) {
              dialogService.query(scope.selection);
            }
          };

          scope.options = attr.options.split(';');

          button.bind('touchstart click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            button.addClass('active');
            submit();
          });
        }
      };
    });
}());
