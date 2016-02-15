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

  angular.module('dialog.component.autoinput', [ 'dialog.service', 'util.maxClicks' ])

    /**
     * @name autoinput
     * @module dialog/component/autoinput
     * @description
     *
     * Displays a clickable element that submits its value to the dialogService.
     */
    .directive('autoinput', function (dialogService) {
      return {
        'restrict': 'E',
        'transclude': true,
        'replace': true,
        'template': '<span class="autoinput" wea-max-clicks="1" ng-transclude></span>',
        'scope': true,
        'link': function (scope, element, attrs) {
          var text = attrs.value || element.text();
          element.bind('touchstart click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            element.parent().addClass('active');
            dialogService.query(text);
          });
        }
      };
    });
}());
