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

  describe('Autoinput directive', function () {
    var $compile;
    var $scope;
    var element;
    var dialogService;
    var init = function () {
      var dialogServiceProvider = function () {
        this.query = sinon.spy();
      };

      angular.mock.module('dialog.component.autoinput', function ($provide) {
        $provide.service('dialogService', dialogServiceProvider);
      });

      angular.mock.inject(function (_$compile_, _$rootScope_, _dialogService_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        dialogService = _dialogService_;
      });
    };

    beforeEach(function () {
      init();
    });

    describe('clicking', function () {
      it('should call DialogController#submit with element text by default', function () {
        element = $compile('<autoinput>Yes</autoinput>')($scope);
        $scope.$digest();
        element.triggerHandler('click');
        expect(dialogService.query).to.have.been.calledWith('Yes');
      });

      it('should call DialogController#submit with \'value\' attribute text if available', function () {
        element = $compile('<autoinput value="Add my spouse to my Life policy">Life</autoinput>')($scope);
        $scope.$digest();
        element.triggerHandler('click');
        expect(dialogService.query).to.have.been.calledWith('Add my spouse to my Life policy');
      });
    });
  });
}());
