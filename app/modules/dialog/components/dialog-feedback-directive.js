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

  angular.module('dialog.component.feedback', ['dialog.service'])

    /**
     * @name feedback
     * @module dialog/component/feedback
     * @description
     *
     * A component for providing feedback about the latest response.
     */
    .directive('feedback', function (dialogService) {
      return {
        'restrict': 'E',
        'templateUrl': 'modules/dialog/components/dialog-feedback.html',
        'scope': {
          'responseId': '@'
        },
        'link': function (scope, element) {
          var yes = angular.element(element.find('a')[0]);
          var no = angular.element(element.find('a')[1]);

          var feedbackSender = function (elemId, feedback) {
            return function (e) {
              e.preventDefault();
              e.stopPropagation();
              element.attr('class', 'ng-scope');
              element.addClass('selected-' + elemId);
              dialogService.feedback(feedback, scope.responseId);
            };
          };

          yes.on('touchstart click', feedbackSender(yes[0].id, true));
          no.on('touchstart click', feedbackSender(no[0].id, false));
        }
      };
    });
}());
