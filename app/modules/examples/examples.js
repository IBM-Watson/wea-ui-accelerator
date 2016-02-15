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
 * @name Examples
 * @module examples
 * @description
 *
 * This module contains examples of including the application in a web page.
 */
  angular.module('examples', ['ngRoute'])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/examples/flexrate', {
          'templateUrl': 'modules/examples/flexrate.html'
        });
    });
}());
