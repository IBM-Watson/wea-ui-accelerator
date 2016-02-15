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
   * @name intro
   * @module intro
   * @description
   *
   * Displays an introductory animation sequence when user first loads the application.
   */
  var introController = function ($scope, $location, $timeout) {
    var self = this;
    var pageTransition = $timeout(function () {
      $location.path('dialog');
    }, 9500);

    self.skip = function () {
      $timeout.cancel(pageTransition);
      $location.path('dialog');
    };

    $scope.$on('wea.quittingStarted', function () {
      $timeout.cancel(pageTransition);
    });
  };

  angular.module('intro', [ 'ngRoute', 'quit' ])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          'controller': introController,
          'controllerAs': 'ctrl',
          'templateUrl': 'modules/intro/intro.html'
        });
    });
}());
