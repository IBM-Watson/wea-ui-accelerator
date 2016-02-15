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
   * @name DialogController
   * @module dialog/controller
   * @description
   *
   * Controls the state of the Dialog view.
   * At any given point of time, the Dialog is in one of the following states:
   * - initial
   *
   *   The "home" view displayed to the user when launching dialog
   *
   * - editing
   *
   *   The view displayed when user is typing a new entry
   *
   * - answered
   *
   *   The view displayed when we've received a response from the dialogService
   *
   * Note: In embedded (widget) mode, the editing state is omitted and user types
   * the questions directly in either "initial" or "answered" views.
   */
  var DialogController = function (_, CONFIG, $scope, $location, $anchorScroll, $timeout, gettextCatalog, dialogService, dialogParser) {
    var self = this;
    var states = {
      'initial': {
        'key': 'initial',
        'inputPlaceholder': gettextCatalog.getString('Let\'s chat. Tell me how I can help you.'),
        'avatar': {
          'state': 'default'
        }
      },
      'editing': {
        'key': 'editing',
        'inputPlaceholder': gettextCatalog.getString('How can I help you?'),
        'avatar': {
          'state': 'listening'
        }
      },
      'answered': {
        'key': 'answered',
        'inputPlaceholder': gettextCatalog.getString('Ask a question or reply to Watson'),
        'avatar': {
          'state': 'thinking-complete'
        }
      }
    };

    var setState = function (state) {
      self.state = _.cloneDeep(state);
    };

    setState(states.initial);

    self.conversation = dialogService.getConversation();

    self.question = null;

    self.showAll = false;

    self.responseType = dialogParser.parseType(dialogService.getLatestResponse());

    self.restart = function () {
      dialogService.end()
        .then(function () {
          setState(states.initial);
        });
    };

    /**
     * Toggles whether to show all previous questions or just the most recent one
     */
    self.toggleShowAll = function () {
      self.showAll = !self.showAll;
      $location.hash(self.showAll ? 'response-last' : '');
      $anchorScroll();
    };

    /**
     * Toggles editing state
     */
    self.edit = function () {
      // Skip "editing" state on widget mode
      if (!CONFIG.EMBEDDED) {
        setState(states.editing);
        self.state.inputPlaceholder =
          dialogParser.parseFollowUpQuestion(dialogService.getLatestResponse()) ||
          self.state.inputPlaceholder;
      }
      self.state.avatarState = 'listening';
    };

    /**
     * Submits the current question using dialogService
     */
    self.submit = function () {
      dialogService.query(self.question, true)
        .then(function () {
          delete self.question;
        });
    };

    $scope.$on('queryBegin', function () {
      self.state.avatar.state = 'thinking';
    });

    $scope.$on('queryEnd', function () {
      self.responseType = dialogParser.parseType(dialogService.getLatestResponse());

      setState(states.answered);

      // Toggle 'Show all' back to default if it is on
      if (self.showAll) {
        self.toggleShowAll();
      }
    });
  };

  angular.module('dialog.controller', [
    'gettext',
    'lodash',
    'ngRoute',
    'ngSanitize',
    'dialog.parser',
    'dialog.service',
    'guidance',
    'menu',
    'quit',
    'util'
    ])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/dialog', {
          'templateUrl': 'modules/dialog/dialog.html',
          'controller': 'DialogController',
          'controllerAs': 'dialogCtrl',
          'reloadOnSearch': false
        });
    })
    .controller('DialogController', DialogController);
}());
