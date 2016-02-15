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

  angular.module('watson.avatar', [])
    /**
     * @name watsonAvatar
     * @module watson.avatar
     * @description
     *
     * # watsonAvatar
     * Displays the animated Watson Avatar. State can be set
     * using the `state` attribute. Color is determined by getting
     * the `color` property of the computed style for the `<watson-avatar>`
     * element.
     *
     * @param {string} state - avatar state, e.g. `listening`
     */
    .directive('watsonAvatar', function ($timeout) {
      return {
        'restrict': 'E',
        'template': '<div id="watson-avatar-container"></div>',
        'scope': {
          'state': '@',
          'image': '@'
        },
        'link': function ($scope, element) {
          var watson = new window.Watson();
          var watsonId = new Date().getTime();
          var container = element[0].querySelector('#watson-avatar-container');

          var getCSSColor = function () {
            if (element[0].currentStyle) {
              return element[0].currentStyle.color;
            }
            else if (window.getComputedStyle) {
              return document.defaultView.getComputedStyle(element[0], null).getPropertyValue('color');
            }
            else {
              return '#fff';
            }
          };

          watson.load(watsonId, container);

          $scope.$watch('state', function (newState) {
            watson.setState(newState);
            $timeout(function () {
              watson.setColor(getCSSColor());
            });
          });

          $scope.$watch('image', function (newImage) {
            watson.setImage(newImage);
          });
        }
      };
    });
}());
