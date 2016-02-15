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

  /**
   * @name weaMaxClicks
   * @module util/maxClicks
   * @description
   *
   * Prevents further click handlers from executing after a certain amount
   * of clicks has been encountered.
   */
  var WeaMaxClicks = function () {
    return {
      'restrict': 'A',
      'scope': true,
      'link': function (scope, element, attrs) {
        var maxClicks = parseInt(attrs.maxClicks, 10) || 1;
        var clickCount = 0;
        element.bind('touchstart click', function (e) {
          clickCount++;
          if (clickCount > maxClicks) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
          }
        });
      }
    };
  };

  angular.module('util.maxClicks', [])
    .directive('weaMaxClicks', WeaMaxClicks);
}());
