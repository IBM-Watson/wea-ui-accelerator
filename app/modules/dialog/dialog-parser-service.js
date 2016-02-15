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

  angular.module('dialog.parser', ['lodash'])

    /**
     * @name DialogParser
     * @module dialog/parser
     * @description
     *
     * Translates the response from the backend (received via
     * {@link DialogService#query} to a format that can be rendered by the application.
     * Most often it achieves this by replacing the received markup with calls to our own directives.
     * For example, given a response markup such as
     *
     * ```html
     * <ul class="bubbles">
     *   <li>
     *     <mct:input>Yes</mct:input>
     *   </li>
     *   <li>
     *     <mct:input>No</mct:input>
     *   </li>
     * </ul>
     * ```
     *
     * `DialogParser` recognizes the `<mct:input>` elements and replaces them
     * with calls to our own <autoinput> directive:
     *
     * ```html
     * <ul class="bubbles">
     *   <li>
     *     <mct:input>Yes</mct:input>
     *   </li>
     *   <li>
     *     <mct:input>No</mct:input>
     *   </li>
     * </ul>
     * ```
     *
     * `DialogParser` also offers methods for extracting any pre-submit messages
     * or follow-up questions contained in the response and determining
     * the response template type.
     */
    .factory('dialogParser', function (_) {
      var decoratePipelineResponse = function (response) {
        var res = _.cloneDeep(response);
        var isPipelineResponse = !!res.document_uri;
        if (isPipelineResponse) {
          res.text = '<blockquote>' +
                       res.text +
                       '<feedback response-id="' + res.response_id + '">' +
                       '</feedback>' +
                     '</blockquote>';
        }
        return res;
      };

      var parseText = function (response) {
        if (response && response.responses) {
          return _(response.responses)
            .map(decoratePipelineResponse)
            .pluck('text')
            .join('');
        }
        else {
          return '';
        }
      };

      var parseMctInputTag = function (text) {
        return text.replace(
          /<mct\:input([^]*?)<\/mct\:input>/g,
          '<autoinput$1</autoinput>'
        );
      };

      var parseMctSelectTag = function (text) {
        var parseOptions = function (input) {
          var optionPattern = /<mct\:option>([^]*?)<\/mct:option>/g;
          var options = input.match(optionPattern);
          if (options) {
            options = options.map(function (option) {
              return option.replace(optionPattern, '$1');
            });
          }
          return options ? options : [];
        };
        return text
          .replace(
            /<mct\:select>[^]*<\/mct\:select>/g,
            '<autoselect data-options="' + parseOptions(text).join(';') + '"></autoselect>'
          );
      };

      var parseMctDatetimeTag = function (text) {
        return text.replace(
          /<mct\:datetime([^]*?)<\/mct\:datetime>/g,
          '<datetime$1</datetime>'
        );
      };

      var parseMctAutolearnitemsTag = function (text) {
        return text
          .replace(
            /<mct\:autolearnitems>([^]*?)<\/mct\:autolearnitems>/g,
            '<ul class="boxes didyoumean">$1</ul>'
          )
          .replace(
            /<mct\:item>([^]*?)<\/mct\:item>/g,
            '<li><autoinput>$1</autoinput></li>'
          );
      };

      var parseMctQuestionTag = function (text) {
        return text
          .replace(
            /<mct\:question>([^]*?)<\/mct\:question>/g,
            '$1'
          );
      };

      var parseMctAvatarTag = function (text) {
        return text.replace(
          /<mct\:avatar([^]*?)<\/mct\:avatar>/g,
          '<watson-avatar ng-click="dialogCtrl.restart()"$1</watson-avatar>'
        );
      };

      var parseMctFeedbackTag = function (text) {
        return text.replace(
          /<mct\:feedback([^]*?)<\/mct\:feedback>/g,
          '<feedback$1</feedback>'
        );
      };

      var removeBrsWithinTag = function (text, tagName) {
        var tagContents = new RegExp('(<' + tagName + '.*?>)' + '([^]*?)' + '(<\/' + tagName + '>)', 'g');
        return text
          .replace(tagContents, function (match, startTag, contents, endTag) {
            return startTag + contents.replace(/<br>/g, '') + endTag;
          });
      };

      var removeBrsWithinUls = function (text) {
        return removeBrsWithinTag(text, 'ul');
      };

      var replaceNewlines = function (text) {
        return text.replace(/\n/g, '');
      };

      var addLinkTargets = function (text) {
        return text.replace(
          /<a ([^]*?)<\/a>/g,
          '<a target="_blank" $1</a>'
        );
      };

      /**
       * Parses a response received from {@link DialogService#query}.
       *
       * @param {object} response - A response object received from {@link DialogService#query}.
       * @return {string} Markup ready to be rendered in the view.
       */
      var parse = function (response) {
        var text = parseText(response);
        var parsed = [text]
          .map(parseMctAvatarTag)
          .map(parseMctInputTag)
          .map(parseMctSelectTag)
          .map(parseMctDatetimeTag)
          .map(parseMctAutolearnitemsTag)
          .map(parseMctQuestionTag)
          .map(parseMctFeedbackTag)
          .map(replaceNewlines)
          .map(removeBrsWithinUls)
          .map(addLinkTargets);
        return parsed[0];
      };

      /**
       * Extracts a follow-up question from a response received from
       * {@link DialogService#query}. Looks for `<mct:question>` tags
       * in the response text and returns the text of the first one it finds.
       *
       * @param {object} response - A response object received from {@link DialogService#query}.
       * @return {string} Text of the first follow-up question found in the response.
       */
      var parseFollowUpQuestion = function (response) {
        var text = parseText(response) || '';
        var questionPattern = /<mct\:question>([^]*?)<\/mct:question>/g;
        var questions;
        questions = text.match(questionPattern);
        if (questions) {
          questions = questions.map(function (question) {
            return question.replace(questionPattern, '$1');
          });
        }
        return questions ? questions[0] : '';
      };

      /**
       * Extracts a preflight message from a response received from
       * {@link DialogService#query}. Looks for `<mct:pre-submit>` tags
       * in the response text and returns the text of the first one it finds.
       * Preflight messages are special messages that are intended to be sent
       * before any following user-generated messages.
       *
       * @param {object} response - A response object received from {@link DialogService#query}.
       * @return {string} Text of the first preflight message found in the response.
       */
      var parsePreflight = function (response) {
        var text = parseText(response) || '';
        var preflightPattern = /<mct\:pre-submit>([^]*?)<\/mct:pre-submit>/g;
        var preflights;
        preflights = text.match(preflightPattern);
        if (preflights) {
          preflights = preflights.map(function (preflight) {
            return preflight.replace(preflightPattern, '$1');
          });
        }
        return preflights ? preflights[0] : '';
      };

      /**
       * Detects the response template type from a response received from
       * {@link DialogService#query}. Looks for known template types in class attributes
       * of any elements in response texts.
       *
       * @param {object} response - A response object received from {@link DialogService#query}.
       * @return {string} Detected response template type or `'default'` if not recognized.
       */
      var parseType = function (response) {
        var text = parseText(response);
        var knownTypes = [ 'summary', 'confirmation', 'transition' ];
        var parsedType = _.find(knownTypes, function (typeName) {
          var typePattern = new RegExp('<div class="' + typeName + '(\\s|")');
          return typePattern.test(text);
        });

        return parsedType || 'default';
      };

      return {
        'parse': parse,
        'parseFollowUpQuestion': parseFollowUpQuestion,
        'parsePreflight': parsePreflight,
        'parseType': parseType
      };
    });
}());
