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

  describe('DialogController', function () {
    var CONFIG = {};
    var $rootScope;
    var $scope;
    var dialogService;
    var dialogParser;
    var dialogCtrl;
    var init = function () {
      angular.mock.module('dialog.controller');
      angular.mock.inject(function (_$rootScope_, $controller, $q) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        dialogService = {
          'getConversation': sinon.stub().returns([]),
          'getLatestResponse': sinon.stub().returns(null),
          'query': sinon.stub().returns($q.when('answer'))
        };
        dialogParser = {
          'parse': sinon.stub().returns('answer'),
          'parseType': sinon.stub().returns(undefined),
          'parseFollowUpQuestion': sinon.stub().returns(undefined)
        };
        dialogCtrl = $controller('DialogController as dialogCtrl', {
          '$scope': $scope,
          'CONFIG': CONFIG,
          'dialogService': dialogService,
          'dialogParser': dialogParser
        });
      });
    };

    beforeEach(function () {
      init();
    });

    /*eslint-disable no-unused-expressions */
    describe('initially', function () {
      it('there conversation should be empty', function () {
        expect(dialogCtrl.conversation).to.be.empty;
      });
      it('state should be \'initial\'', function () {
        expect(dialogCtrl.state.key).to.eql('initial');
      });
    });

    describe('editing the question', function () {
      it('should trigger editing state', function () {
        dialogCtrl.edit();
        expect(dialogCtrl.state.key).to.eql('editing');
      });
      it('should not trigger editing state in embedded mode', function () {
        CONFIG.EMBEDDED = true;
        dialogCtrl.edit();
        expect(dialogCtrl.state.key).to.eql('initial');
      });
    });

    describe('submitting a question', function () {
      it('sends the question to dialogService', function () {
        dialogCtrl.submit();
        expect(dialogService.query).to.have.been.calledOnce;
      });
      it('clears the question', function () {
        dialogCtrl.question = 'Who are you?';
        dialogCtrl.submit();
        $scope.$digest();
        expect(dialogCtrl.question).to.be.empty;
      });
    });

    describe('on \'queryEnd\' event', function () {
      it('sets state to \'answered\'', function () {
        $rootScope.$broadcast('queryEnd');
        $scope.$digest();
        expect(dialogCtrl.state.key).to.eql('answered');
      });
    });
    /*eslint-enable no-unused-expressions */
  });
}());
