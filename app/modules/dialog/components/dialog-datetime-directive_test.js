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

  describe('datetime directive', function () {
    var $compile;
    var $scope;
    var element;
    var dialogService;
    var init = function () {
      var dialogServiceProvider = function () {
        this.query = sinon.spy();
      };

      angular.mock.module('dialog.component.datetime', function ($provide) {
        $provide.service('dialogService', dialogServiceProvider);
      });

      angular.mock.inject(function (_$compile_, _$rootScope_, _dialogService_) {
        $compile = _$compile_;
        $scope = _$rootScope_.$new();
        dialogService = _dialogService_;
        element = $compile('<datetime></datetime>')($scope);
        $scope.$digest();
      });
    };

    beforeEach(function () {
      init();
    });

    describe('clicking the confirm button', function () {
      it('should call DialogController#submit with selected date', function () {
        $scope.date = new Date(1288323623006);
        $scope.time = new Date(1288323623006);
        element.find('button').triggerHandler('click');
        // expect($scope.dialogCtrl.submit).to.have.been.calledWith('10/28/2010 20:40');
        expect(dialogService.query).to.have.been.calledWith('10/28/2010 20:40');
      });
      /*eslint-disable no-unused-expressions */
      it('should not call DialogController#submit if nothing selected', function () {
        element.find('button').triggerHandler('click');
        // expect($scope.dialogCtrl.submit).to.not.have.been.called;
        expect(dialogService.query).to.not.have.been.called;
      });
      /*eslint-enable no-unused-expressions */
    });
  });
}());
