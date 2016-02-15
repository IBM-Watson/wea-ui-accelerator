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

  describe('Feedback directive', function () {
    var $compile;
    var $scope;
    var element;
    var dialogService;
    var init = function () {
      var dialogServiceProvider = function () {
        this.feedback = sinon.spy();
      };

      angular.mock.module('dialog.component.feedback', 'modules/dialog/components/dialog-feedback.html', function ($provide) {
        $provide.service('dialogService', dialogServiceProvider);
      });

      angular.mock.inject(function (_$compile_, _$rootScope_, _dialogService_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        dialogService = _dialogService_;
        element = $compile('<feedback></feedback>')($scope);
        $scope.$digest();
      });
    };

    beforeEach(function () {
      init();
    });

    describe('clicking "Yes"', function () {
      it('should call DialogController#feedback with \'true\'', function () {
        var yes = angular.element(element.find('a')[0]);
        yes.triggerHandler('click');
        expect(dialogService.feedback).to.have.been.calledWith(true);
      });
    });

    describe('clicking "No"', function () {
      it('should call DialogController#feedback with \'false\'', function () {
        var no = angular.element(element.find('a')[1]);
        no.triggerHandler('click');
        expect(dialogService.feedback).to.have.been.calledWith(false);
      });
    });
  });
}());
