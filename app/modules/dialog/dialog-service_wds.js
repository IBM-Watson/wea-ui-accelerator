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

  angular.module('dialog.service.impl.wds', ['dialog.parser'])

    /**
     * @name dialogServiceWDS
     * @module dialog/service
     * @description
     *
     * Implements the dialogService interface
     * using Watson Dialog Services (WDS).
     */
    .service('dialogServiceWDS', function (CONFIG, $http, $q, $rootScope, dialogParser) {
      var clientId;
      var initialized;
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

      /**
       * Retrieves a clientId for the API connection.
       *
       * @return {string} The current client id if it exists,
       *                  otherwise a new one retrieved from the API.
       */
      var getClientId = function () {
        if (clientId) {
          // Reuse existing clientId
          return $q.when(clientId);
        }
        else {
          return $http.get(CONFIG.WDS_API_URL + '/getclientid')
          .then(function (response) {
            clientId = response.data.message.clientid;
            return clientId;
          });
        }
      };

      var initChat = function (cid) {
        if (initialized) {
          return $q.when(initialized);
        }
        return $http.get(CONFIG.WDS_API_URL + '/initchat', {
          'params': {
            'applicationid': CONFIG.WDS_APP_ID,
            'clientid': cid
          }
        })
        .then(function (response) {
          initialized = response;
          return initialized;
        });
      };

      var getResponse = function (question) {
        return $http.get(CONFIG.WDS_API_URL + '/getresponse', {
          'params': {
            'applicationid': CONFIG.WDS_APP_ID,
            'clientid': clientId,
            'input': question
          }
        })
        .then(function (response) {
          return {
            'message': response.data.message.input,
            'responses': response.data.message.response
          };
        });
      };

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

        return getClientId()
          .then(initChat)
          .then(function () {
            // Get response to each question sequentially
            var response = $q.when();
            input.forEach(function (question) {
              response = response.then(function (res) {
                if (res) {
                  conversation.push(res);
                }
                return getResponse(question);
              });
            });
            return response;
          })
          .then(function (lastRes) {
            if (lastRes) {
              conversation.push(lastRes);
            }
            $rootScope.$broadcast('queryEnd');
            return conversation;
          });
      };

      var feedback = function () {
        throw new Error('Sending feedback is not implemented on WDS');
      };

      /**
       * Resets a session with the Dialog API.
       */
      var end = function () {
        clientId = undefined;
        initialized = undefined;
        conversation = [];
        return $q.when();
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
