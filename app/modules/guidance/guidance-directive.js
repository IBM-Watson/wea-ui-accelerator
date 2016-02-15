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

  angular.module('guidance', [])
    /**
     * @name guidance
     * @module guidance
     * @description
     *
     * Displays the "Helpful Links" drawer.
     *
     * @see {@link ../dialog/dialog.html} for a usage example.
     */
    .directive('guidance', function () {
      return {
        'restrict': 'E',
        'templateUrl': 'modules/guidance/guidance.html',
        'scope': true
      };
    });
}());
