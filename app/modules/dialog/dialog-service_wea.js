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

  angular.module('dialog.service.impl.wea', ['dialog.parser'])

    /**
     * @name dialogServiceWEA
     * @module dialog/service
     * @description
     *
     * Implements the dialogService interface
     * using the WEA `/conversation` API.
     */
    .service('dialogServiceWEA', function (CONFIG, $http, $q, $rootScope, dialogParser) {
      var conversationId;
      var conversation = [];

      /**
       * Gets all entries (responses) in the conversation so far.
       *
       * @return {object[]} All entries in the conversation.
       */
      var getConversation = function () {
        return conversation;
      };

      /**
       * A shorthand for retrieving the latest entry in the conversation.
       *
       * @return {object} The latest entry in the conversation.
       */
      var getLatestResponse = function () {
        return conversation.length > 0
               ? conversation[conversation.length - 1]
               : undefined;
      };

      var startConversation = function () {
        if (conversationId) {
          // Reuse existing conversationId
          return $q.when(conversationId);
        }
        else {
          return $http.post(
            CONFIG.WEA_API_URL + '/conversation',
            {},
            {
              'headers': {
                'user_token': CONFIG.WEA_API_TOKEN
              }
            })
          .then(function (response) {
            conversationId = response.data.conversation_id;
            return conversationId;
          });
        }
      };

      var getResponse = function (cid, question) {
        return $http.post(
          CONFIG.WEA_API_URL + '/conversation/' + cid,
          { 'message': question }
        )
        .then(function (response) {
          return response.data;
        });
      };

      var endConversation = function (cid) {
        return cid ? $http.post(CONFIG.WEA_API_URL + '/conversation/' + cid + '/end')
                   : $q.when();
      };

      /**
       * Sends messages to the WEA `/conversation` API and receives responses.
       *
       * @param {string | string[]} input - a message or an array of messages to be sent to WEA API.
       * @param {boolean} preflight - whether we should parse and send any preflight messages from the previous response
       * @return {Promise} All entries in the conversation after having received responses for all messages.
       */
      var query = function (input, preflight) {
        var preflightMessage;

        $rootScope.$broadcast('queryBegin');

        if (typeof input === 'string') {
          input = [input];
        }

        if (preflight) {
          // Prepend the input with the preflight message
          preflightMessage = dialogParser.parsePreflight(getLatestResponse());
          if (preflightMessage) {
            input.unshift(preflightMessage);
          }
        }

        return startConversation()
          .then(function (cid) {
            // Get response to each question sequentially
            var response = $q.when();
            input.forEach(function (question) {
              response = response.then(function (res) {
                if (res) {
                  conversation.push(res);
                }
                return getResponse(cid, question);
              });
            });
            return response;
          }).then(function (lastRes) {
            if (lastRes) {
              conversation.push(lastRes);
            }
            $rootScope.$broadcast('queryEnd');
            return conversation;
          });
      };

      /**
       * Provide feedback about the latest response using the WEA `/feedback` API.
       *
       * @param {boolean} wasHelpful - the actual feedback: whether the latest response was useful or not
       * @param {string} responseId - (optional) a specific target response id within the latest message. Defaults to the first response in the latest message.
       * @return {Promise} Raw API response.
       */
      var feedback = function (wasHelpful, responseId) {
        var latestResponse = getLatestResponse();
        var messageId;
        var rating;

        if (!latestResponse) {
          throw new Error('Cannot send feedback for an empty conversation.');
        }

        messageId = latestResponse.message_id;
        rating = wasHelpful ? 1 : -1;
        responseId = responseId || latestResponse.responses[0].response_id;

        return $http.post(
          CONFIG.WEA_API_URL + '/feedback',
          {
            'conversation_id': conversationId,
            'message_id': messageId,
            'response_id': responseId,
            'rating': rating
          }
        )
        .then(function (response) {
          return response.data;
        });
      };

      /**
       * Ends a session with the WEA `/conversation` API.
       */
      var end = function () {
        return endConversation(conversationId)
          .then(function () {
            conversationId = undefined;
            conversation.length = 0;
          });
      };

      return {
        'getConversation': getConversation,
        'getLatestResponse': getLatestResponse,
        'query': query,
        'feedback': feedback,
        'end': end
      };
    });
}());
