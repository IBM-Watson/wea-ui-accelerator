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

  describe('dialogServiceWEA', function () {
    var $httpBackend;
    var dialogParser;
    var service;
    var cid = '14bdac67-faa8-42a6-9bba-89943fd0e82d';

    var testQuestion = 'I recently married';
    var testResponse = {
      'message_id': 'cbf30bf9-814c-417d-b6d5-b53c1de689aa',
      'message': testQuestion,
      'responses': [
        {
          'response_id': 'cfd58553-82b8-43b9-ba6f-6f92b97d504f',
          'text': 'Congratulations Peter!',
          'confidence': 0
        },
        {
          'response_id': 'ebb4555f-9b11-41bc-8209-0a6550fcaf63',
          'text': '<mct:question>What is your spouse\'s name?</mct:question>',
          'confidence': 0
        }
      ]
    };

    var CONFIG = {
      'WEA_API_URL': 'http://example.com'
    };

    var urls = {
      'startConversation': CONFIG.WEA_API_URL + '/conversation',
      'conversation': CONFIG.WEA_API_URL + '/conversation/' + cid,
      'endConversation': CONFIG.WEA_API_URL + '/conversation/' + cid + '/end',
      'feedback': CONFIG.WEA_API_URL + '/feedback'
    };

    var dialogParserProvider = function () {
      this.parsePreflight = sinon.spy();
    };

    var init = function () {
      angular.module('test', []).constant('CONFIG', CONFIG);

      angular.mock.module('dialog.service.impl.wea', 'test', function ($provide) {
        $provide.service('dialogParser', dialogParserProvider);
      });

      angular.mock.inject(function (_$httpBackend_, $injector, _dialogParser_) {
        $httpBackend = _$httpBackend_;
        dialogParser = _dialogParser_;
        service = $injector.get('dialogServiceWEA');
      });
    };

    var stub = function () {
      $httpBackend.whenPOST(urls.startConversation)
        .respond(200, {
          'conversation_id': cid
        });
      $httpBackend.whenPOST(urls.conversation, { 'message': testQuestion }).respond(200, testResponse);
      $httpBackend.whenPOST(urls.endConversation).respond(200);
      $httpBackend.whenPOST(urls.feedback).respond(200);
    };

    beforeEach(function () {
      init();
      stub();
    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('querying for the first time', function () {
      it('initializes the conversation', function () {
        $httpBackend.expectPOST(urls.startConversation);
        $httpBackend.expectPOST(urls.conversation);
        service.query(testQuestion);
        $httpBackend.flush(2);
      });
    });

    describe('subsequent queries', function () {
      it('should not re-initialize the chat session', function () {
        $httpBackend.expectPOST(urls.startConversation);
        $httpBackend.expectPOST(urls.conversation);
        service.query(testQuestion);
        $httpBackend.flush(2);
        service.query(testQuestion);
        // Only one getResponse request should have been made since last flush
        $httpBackend.flush(1);
      });
    });

    describe('querying', function () {
      /*eslint-disable no-unused-expressions */
      it('prepends the input with the preflight message', function () {
        $httpBackend.expectPOST(urls.conversation);
        service.query(testQuestion, true);
        expect(dialogParser.parsePreflight).to.have.been.calledOnce;
        $httpBackend.flush();
      });
      /*eslint-enable no-unused-expressions */

      it('returns the unmodified response received from the API', function () {
        var response;
        $httpBackend.expectPOST(urls.conversation);
        response = service.query(testQuestion);
        expect(response).to.eventually.eql([testResponse]);
        $httpBackend.flush();
      });

      it('records the conversation', function () {
        var conversation;

        service.query(testQuestion);
        $httpBackend.flush();

        conversation = service.getConversation();
        expect(conversation[0]).to.eql(testResponse);
      });
    });

    describe('ending', function () {
      it('ends the conversation', function () {
        service.query(testQuestion);
        $httpBackend.flush();

        $httpBackend.expectPOST(urls.endConversation);
        service.end();
        $httpBackend.flush();
      });

      /*eslint-disable no-unused-expressions */
      it('resets the conversation', function () {
        service.query(testQuestion);
        $httpBackend.flush();
        service.end();
        $httpBackend.flush();
        expect(service.getConversation()).to.be.empty;
      });
      /*eslint-enable no-unused-expressions */
    });

    describe('sending feedback', function () {
      it('POSTs feedback to /feedback', function () {
        service.query(testQuestion);
        $httpBackend.flush();

        $httpBackend.expectPOST(urls.feedback);
        service.feedback(true, 'foo');

        $httpBackend.flush();
      });

      it('fails if conversation empty', function () {
        expect(service.feedback.bind(service, true, 'foo'))
          .to.throw('Cannot send feedback for an empty conversation.');
      });
    });
  });
}());
