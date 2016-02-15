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
   * @name weaBlurOn
   * @module util/blurOn
   * @description
   *
   * Calls `blur()` on the element on a given event.
   * For example, adding attribute `wea-blur-on="queryBegin"` to an input
   * element would cause the input field to blur when a `queryBegin` event
   * occurs.
   */
  var WeaBlurOn = function () {
    return function (scope, element, attr) {
      scope.$on(attr.weaBlurOn, function () {
        element[0].blur();
      });
    };
  };

  angular.module('util.blurOn', [])
    .directive('weaBlurOn', WeaBlurOn);
}());
