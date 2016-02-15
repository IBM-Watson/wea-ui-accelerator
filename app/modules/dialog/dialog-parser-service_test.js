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

  describe('dialogParser', function () {
    var service;

    var init = function () {
      angular.mock.module('dialog.parser');
      angular.mock.inject(function ($injector) {
        service = $injector.get('dialogParser');
      });
    };

    var response = function (text) {
      return {
        'message_id': 'cbf30bf9-814c-417d-b6d5-b53c1de689aa',
        'message': 'Test question',
        'responses': [
          {
            'response_id': 'cfd58553-82b8-43b9-ba6f-6f92b97d504f',
            'text': text,
            'confidence': 0
          }
        ]
      };
    };

    var pipelineResponse = function (text) {
      return {
        'message_id': 'cbf30bf9-814c-417d-b6d5-b53c1de689aa',
        'message': 'Test question',
        'responses': [
          {
            'response_id': '23d8e330-f5a5-443d-9818-d52353de0c50',
            'text': text,
            'title': 'Test title',
            'confidence': 0.39568,
            'document_uri': '/document/36BB89DDEF98D7F03857B876554CB661'
          }
        ]
      };
    };

    beforeEach(function () {
      init();
    });

    it('should parse yes/no boolean selector bubbles', function () {
      var text = 'Her DOB is 01/01/01, is this correct?' +
                 '<ul class="bubbles">' +
                 '  <li>' +
                 '     <mct:input>Yes</mct:input>' +
                 '  </li>' +
                 '  <li>' +
                 '     <mct:input>No</mct:input>' +
                 '  </li>' +
                 '</ul>';

      var expected = 'Her DOB is 01/01/01, is this correct?' +
                     '<ul class="bubbles">' +
                     '  <li>' +
                     '     <autoinput>Yes</autoinput>' +
                     '  </li>' +
                     '  <li>' +
                     '     <autoinput>No</autoinput>' +
                     '  </li>' +
                     '</ul>';

      var parsed = service.parse(response(text));
      expect(parsed).to.equal(expected);
    });

    it('should parse inputs with value attributes', function () {
      var text = 'Would you want to add your spouse to your other policies?' +
                 '<ul class="boxes">' +
                 '  <li>' +
                 '    <mct:input value="Add my spouse to my Life policy">Life</mct:input>' +
                 '  </li>' +
                 '  <li>' +
                 '    <mct:input value="Add my spouse to my Auto policy">Auto</mct:input>' +
                 '  </li>' +
                 '</ul>';

      var expected = 'Would you want to add your spouse to your other policies?' +
                     '<ul class="boxes">' +
                     '  <li>' +
                     '    <autoinput value="Add my spouse to my Life policy">Life</autoinput>' +
                     '  </li>' +
                     '  <li>' +
                     '    <autoinput value="Add my spouse to my Auto policy">Auto</autoinput>' +
                     '  </li>' +
                     '</ul>';

      var parsed = service.parse(response(text));
      expect(parsed).to.equal(expected);
    });

    it('should parse option box lists', function () {
      var text = 'Which of your policies would you like to start with?' +
                 '<ul class="boxes">' +
                 '  <li>' +
                 '     <mct:input>Home</mct:input>' +
                 '  </li>' +
                 '  <li>' +
                 '     <mct:input>Auto</mct:input>' +
                 '  </li>' +
                 '  <li>' +
                 '     <mct:input>Life</mct:input>' +
                 '  </li>' +
                 '</ul>';

      var expected = 'Which of your policies would you like to start with?' +
                     '<ul class="boxes">' +
                     '  <li>' +
                     '     <autoinput>Home</autoinput>' +
                     '  </li>' +
                     '  <li>' +
                     '     <autoinput>Auto</autoinput>' +
                     '  </li>' +
                     '  <li>' +
                     '     <autoinput>Life</autoinput>' +
                     '  </li>' +
                     '</ul>';

      var parsed = service.parse(response(text));
      expect(parsed).to.equal(expected);
    });

    it('should parse selector components', function () {
      var text = 'Please select the amount of coverage you would like:' +
                 '<mct:select>' +
                 '  <mct:option>15,000</mct:option>' +
                 '  <mct:option>25,000</mct:option>' +
                 '  <mct:option>50,000</mct:option>' +
                 '  <mct:option>75,000</mct:option>' +
                 '  <mct:option>100,000</mct:option>' +
                 '  <mct:option>125,000</mct:option>' +
                 '  <mct:option>150,000</mct:option>' +
                 '  <mct:option>175,000</mct:option>' +
                 '  <mct:option>200,000</mct:option>' +
                 '</mct:select>';

      var expected = 'Please select the amount of coverage you would like:' +
                     '<autoselect data-options="15,000;25,000;50,000;75,000;100,000;125,000;150,000;175,000;200,000">' +
                     '</autoselect>';

      var parsed = service.parse(response(text));
      expect(parsed).to.equal(expected);
    });

    it('should ignore newline characters', function () {
      var text = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.';
      var expected = 'First paragraph.Second paragraph.Third paragraph.';
      var parsed = service.parse(response(text));
      expect(parsed).to.equal(expected);
    });

    it('should remove <br>s within <ul> elements', function () {
      var text = '<ul class="boxes"><br>  <li>    <mct:input>Home</mct:input>  </li></ul>';
      var expected = '<ul class="boxes">  <li>    <autoinput>Home</autoinput>  </li></ul>';
      var parsed = service.parse(response(text));
      expect(parsed).to.equal(expected);
    });

    it('should not remove <br>s outside <ul> elements', function () {
      var text = '<ul class="boxes"><br><li>    <mct:input>Home</mct:input>  </li></ul><br><ul></ul>';
      var expected = '<ul class="boxes"><li>    <autoinput>Home</autoinput>  </li></ul><br><ul></ul>';
      var parsed = service.parse(response(text));
      expect(parsed).to.equal(expected);
    });

    it('should add target="_blank" to any links', function () {
      var text = '<a class="taoLinkClass" href="https://www.usaa.com/inet/pages/advice-home-tobuyornot">To Buy or Not to Buy? Advice for Military Families</a>';
      var expected = '<a target="_blank" class="taoLinkClass" href="https://www.usaa.com/inet/pages/advice-home-tobuyornot">To Buy or Not to Buy? Advice for Military Families</a>';
      var parsed = service.parse(response(text));
      expect(parsed).to.equal(expected);
    });

    it('should parse "Did you mean..." items', function () {
      var text = 'Did you mean...\n\n' +
                 '<mct:autolearnitems>' +
                 '<mct:item>Auto</mct:item>' +
                 '<mct:item>Home</mct:item>' +
                 '<mct:item>Life</mct:item>' +
                 '<mct:item>None of the above</mct:item>' +
                 '</mct:autolearnitems>';

      var expected = 'Did you mean...' +
                     '<ul class="boxes didyoumean">' +
                     '<li><autoinput>Auto</autoinput></li>' +
                     '<li><autoinput>Home</autoinput></li>' +
                     '<li><autoinput>Life</autoinput></li>' +
                     '<li><autoinput>None of the above</autoinput></li>' +
                     '</ul>';

      var parsed = service.parse(response(text));
      expect(parsed).to.equal(expected);
    });

    it('should parse avatar element and add restart callback', function () {
      var text = '<div class="summary full-screen">\n' +
                 '  <h3>Summary of Coverage</h3>\n' +
                 '  <mct:avatar state="default"></mct:avatar>' +
                 '  <p class="summary__cost"><strong>$153.35</strong>/ month</p>\n' +
                 '</div>';

      var expected = '<div class="summary full-screen">' +
                     '  <h3>Summary of Coverage</h3>' +
                     '  <watson-avatar ng-click="dialogCtrl.restart()" state="default"></watson-avatar>' +
                     '  <p class="summary__cost"><strong>$153.35</strong>/ month</p>' +
                     '</div>';

      var parsed = service.parse(response(text));
      expect(parsed).to.equal(expected);
    });

    it('should parse feedback component', function () {
      var text = '<blockquote>' +
                 '  A rider is a provision of an insurance policy...' +
                 '  <mct:feedback></mct:feedback>' +
                 '</blockquote>';

      var expected = '<blockquote>' +
                     '  A rider is a provision of an insurance policy...' +
                     '  <feedback></feedback>' +
                     '</blockquote>';

      var parsed = service.parse(response(text));
      expect(parsed).to.equal(expected);
    });

    it('should ignore <mct:question> tags when parsing response', function () {
      var text = 'Ok, her DOB is 01/01/01. ' +
                 '<mct:question>What is her SSN?</mct:question>';

      var expected = 'Ok, her DOB is 01/01/01. What is her SSN?';

      var parsed = service.parse(response(text));
      expect(parsed).to.equal(expected);
    });


    it('should decorate pipeline responses', function () {
      var text = 'VGLI provides for the conversion of Servicemembers\' Group Life Insurance';
      var res = pipelineResponse(text);

      var expected = '<blockquote>' + text +
                     '<feedback response-id="' + res.responses[0].response_id + '"></feedback>' +
                     '</blockquote>';

      var parsed = service.parse(res);
      expect(parsed).to.equal(expected);
    });

    describe('parsing the follow-up question', function () {
      it('should extract the contents of <mct:question> tag when extracting question', function () {
        var text = 'Ok, her DOB is 01/01/01. ' +
                   '<mct:question>What is her SSN?</mct:question>';

        var expected = 'What is her SSN?';

        var parsed = service.parseFollowUpQuestion(response(text));
        expect(parsed).to.equal(expected);
      });

      it('should return empty for undefined input', function () {
        var parsed = service.parseFollowUpQuestion(undefined);
        expect(parsed).to.equal('');
      });

      it('should return empty if no <mct:question> found', function () {
        var parsed = service.parseFollowUpQuestion(response('Lorem ipsum.'));
        expect(parsed).to.equal('');
      });
    });

    describe('parsing the preflight message', function () {
      it('should extract the contents of <mct:pre-submit> tag', function () {
        var text = 'Ok, her DOB is 01/01/01. ' +
                   '<mct:pre-submit>I have another question</mct:pre-submit>';

        var expected = 'I have another question';

        var parsed = service.parsePreflight(response(text));
        expect(parsed).to.equal(expected);
      });
    });

    describe('detecting response type', function () {
      it('should detect predefined response types', function () {
        var text = 'Lulz<div class="summary full-screen">\n' +
                   '  <h3>Summary of Coverage</h3>\n' +
                   '  <mct:avatar state="default" color="blue"></mct:avatar>' +
                   '  <p class="summary__cost"><strong>$153.35</strong>/ month</p>\n' +
                   '</div>';

        var parsed = service.parseType(response(text));
        expect(parsed).to.equal('summary');
      });

      it('should return \'default\' for other responses', function () {
        var text = 'Ok got it.';

        var parsed = service.parseType(response(text));
        expect(parsed).to.equal('default');
      });
    });
  });
}());
