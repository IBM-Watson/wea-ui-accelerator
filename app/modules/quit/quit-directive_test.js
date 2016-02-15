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

  describe('quit directive', function () {
    var dialogService;
    var $window;
    var $scope;
    var element;

    beforeEach(function () {
      var dialogServiceProvider = function () {
        this.end = sinon.stub().returns({
          'then': function (cb) {
            cb();
          }
        });
      };

      var windowProvider = function () {
        this.location = {};
      };

      var locationProvider = function () {
        this.search = sinon.stub().returns({ 'returnTo': 'foo' });
      };

      angular.mock.module('quit', 'modules/quit/quit.html', function ($provide) {
        $provide.service('dialogService', dialogServiceProvider);
        $provide.service('$window', windowProvider);
        $provide.service('$location', locationProvider);
        $provide.constant('CONFIG', {});
      });

      angular.mock.inject(function ($compile, $rootScope, _dialogService_, _$window_) {
        dialogService = _dialogService_;
        $window = _$window_;
        $scope = $rootScope.$new();
        $scope.$emit = sinon.spy();
        element = $compile('<wea-quit></wea-quit>')($scope);
        $scope.$digest();
      });
    });

    describe('clicking the quit icon', function () {
      beforeEach(function () {
        var quitIcon = angular.element(element.find('span')[0]);
        quitIcon.triggerHandler('click');
      });

      it('should emit a \'quittingStarted\' event', function () {
        expect($scope.$emit).to.have.been.calledWith('wea.quittingStarted');
      });
    });

    describe('canceling', function () {
      beforeEach(function () {
        var cancelButton = angular.element(element.find('button')[1]);
        cancelButton.triggerHandler('click');
      });

      it('should emit a \'quittingCanceled\' event', function () {
        expect($scope.$emit).to.have.been.calledWith('wea.quittingCanceled');
      });
    });

    describe('confirming', function () {
      beforeEach(function () {
        var confirmButton = angular.element(element.find('button')[0]);
        confirmButton.triggerHandler('click');
      });

      /*eslint-disable no-unused-expressions */
      it('should reset dialogService', function () {
        expect(dialogService.end).to.have.been.calledOnce;
      });
      /*eslint-enable no-unused-expressions */

      it('should take the user back to application root', function () {
        expect($window.location.href).to.equal('foo');
      });

      it('should emit a \'quittingDone\' event', function () {
        expect($scope.$emit).to.have.been.calledWith('wea.quittingDone');
      });
    });
  });
}());
