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
  /**
   * @module styleguide.controller
   * @description
   *
   * Displays a styleguide page showcasing various templates
   * and styles used within the application.
   */
  var StyleGuideController = function ($sce) {
      var self = this;
      self.avatarState = 'default';

      self.examples = {};

      self.examples.themes = {
        'default': 'Is this correct?\n' +
                   '<ul class="bubbles">\n' +
                   '  <li>\n' +
                   '    <mct:input>Yes</mct:input>\n' +
                   '  </li>\n' +
                   '  <li>\n' +
                   '     <mct:input>No</mct:input>\n' +
                   '  </li>\n' +
                   '</ul>',
        'summary': '<div class="summary full-screen">\n' +
                   '<h3>Summary of Coverage</h3>\n' +
                   '<mct:avatar state="default"></mct:avatar>' +
                   '<p class="summary__cost"><strong>$153.35</strong>/ month</p>\n' +
                   '<ul class="summary__items">\n' +
                   '  <li class="summary__item"><span>Address:</span><span>51 Astor Place<br/>New York, NY<br/>10003</span></li>\n' +
                   '  <li class="summary__item"><span>Structure:</span><span>$200,000</span></li>\n' +
                   '  <li class="summary__item"><span>Personal<br/>Belongings:</span><span>$25,000</span></li>\n' +
                   '  <li class="summary__item"><span>Liability:</span><span>$150,000</span></li>\n' +
                   '  <li class="summary__item"><span>Deductable:</span><span>$500</span></li>\n' +
                   '  <li class="summary__item"><span>Autopay:</span><span>Yes</span></li>\n' +
                   '</ul>\n' +
                   '<ul class="boxes">\n' +
                   '  <li>\n' +
                   '    <mct:input>OK</mct:input>\n' +
                   '  </li>\n' +
                   '  <li class="secondary">\n' +
                   '     <mct:input>Make Changes</mct:input>\n' +
                   '  </li>\n' +
                   '</ul>' +
                   '</div>\n',
        'confirmation': '<div class="confirmation full-screen">\n' +
                        '<mct:avatar state="thinking-complete"></mct:avatar>' +
                        '<p>Thank you.<p>\n' +
                        '<p>Here are the changes we will make to your policy.</p>\n' +
                        '<p class="confirmation__change">Add spouse to Home policy</p>\n' +
                        '<ul class="confirmation__items">\n' +
                        '  <li class="confirmation__item"><span>First Name:</span><span>Joanne</span></li>\n' +
                        '  <li class="confirmation__item"><span>Middle:</span><span></span></li>\n' +
                        '  <li class="confirmation__item"><span>Last Name:</span><span>Campbell</span></li>\n' +
                        '  <li class="confirmation__item"><span>Relation:</span><span>Spouse</span></li>\n' +
                        '  <li class="confirmation__item"><span>Social:</span><span>XXX-XX-6789</span></li>\n' +
                        '  <li class="confirmation__item"><span>Birthdate:</span><span>12/24/1979</span></li>\n' +
                        '</ul>\n' +
                        '<p class="call-to-action">\n' +
                        '  Is this information correct?\n' +
                        '</p>\n' +
                        '<ul class="bubbles">\n' +
                        '  <li>\n' +
                        '    <mct:input>Yes</mct:input>\n' +
                        '  </li>\n' +
                        '  <li>\n' +
                        '     <mct:input>No</mct:input>\n' +
                        '  </li>\n' +
                        '</ul>' +
                        '</div>\n',
        'transition': '<div class="transition full-screen">\n' +
                      '<mct:avatar state="thinking-complete"></mct:avatar>' +
                      '<p>Great! It is always good to review your coverage after a new life event.<p>\n' +
                      '<p>Would you like to do that now?</p>\n' +
                      '<ul class="bubbles">\n' +
                      '  <li>\n' +
                      '    <mct:input>Yes</mct:input>\n' +
                      '  </li>\n' +
                      '  <li>\n' +
                      '     <mct:input>No</mct:input>\n' +
                      '  </li>\n' +
                      '</ul>' +
                      '</div>\n'
      };

      self.examples.components = [
        {
          'title': 'Boolean bubbles',
          'description': 'Bubbles are typically used for boolean Yes/No answers.',
          'response': 'Is this correct?\n' +
                      '<ul class="bubbles">\n' +
                      '  <li>\n' +
                      '    <mct:input>Yes</mct:input>\n' +
                      '  </li>\n' +
                      '  <li>\n' +
                      '     <mct:input>No</mct:input>\n' +
                      '  </li>\n' +
                      '</ul>'
        },
        {
          'title': 'Option boxes',
          'description': 'If there are more than two options, you can use boxes.',
          'response': 'Which of your policies would you like to start with?\n' +
                      '<ul class="boxes">\n' +
                      '  <li>\n' +
                      '    <mct:input>Home</mct:input>\n' +
                      '  </li>\n' +
                      '  <li>\n' +
                      '     <mct:input>Auto</mct:input>\n' +
                      '  </li>\n' +
                      '  <li>\n' +
                      '     <mct:input>Life</mct:input>\n' +
                      '  </li>\n' +
                      '  <li>\n' +
                      '     <mct:input>A very long text demonstrating wrapping text to multiple lines</mct:input>\n' +
                      '  </li>\n' +
                      '</ul>'
        },
        {
          'title': 'Dropdown selector',
          'description': 'If there are many options, consider using a dropdown.',
          'response': 'Please select the amount of coverage you would like:\n' +
                      '<mct:select>\n' +
                      '  <mct:option>15,000</mct:option>\n' +
                      '  <mct:option>25,000</mct:option>\n' +
                      '  <mct:option>50,000</mct:option>\n' +
                      '  <mct:option>75,000</mct:option>\n' +
                      '  <mct:option>100,000</mct:option>\n' +
                      '</mct:select>'
        },
        {
          'title': 'Separate value and text',
          'description': 'The text shown to the user doesn\'t have to be the same as the message sent to WEA.',
          'response': '<ul class="boxes">\n' +
                      '  <li>\n' +
                      '    <mct:input value="Add my spouse to Home policy">Home</mct:input>\n' +
                      '  </li>\n' +
                      '</ul>'
        },
        {
          'title': 'Date & time picker',
          'description': $sce.trustAsHtml('Date picker sends the selected values as a message in the format <code>MM/dd/yyyy HH:mm</code>'),
          'response': 'Please select a date:\n' +
                      '<mct:datetime></mct:datetime>'
        },
        {
          'title': 'Did you mean...',
          'description': 'Suggestions are shown as option boxes by default with the last item highlighted.',
          'response': 'Did you mean...\n\n' +
                      '<mct:autolearnitems>\n' +
                      '  <mct:item>Auto</mct:item>\n' +
                      '  <mct:item>Home</mct:item>\n' +
                      '  <mct:item>Life</mct:item>\n' +
                      '  <mct:item>None of the above</mct:item>\n' +
                      '</mct:autolearnitems>'
        }
      ];

    self.examples.formatting = [
        {
          'title': 'Line breaks and body text',
          'description': 'Response contents can be structured and styled manually for simple formatting needs.',
          'response': 'Thanks.<br>\n' +
                      'I also <em>need</em> to know her <strong>Social Security Number</strong>.\n'
        },
        {
          'title': 'Emphasized call to action',
          'description': $sce.trustAsHtml('Use the <code>call-to-action</code> class to declare the next action.'),
          'response': 'The named policyholders receive the most extensive ' +
                      'coverage under the policies.\n' +
                      '<p class="call-to-action">\n' +
                      '  Would you like to add your spouse to your policies now?\n' +
                      '</p>\n' +
                      '<ul class="bubbles">\n' +
                      '  <li>\n' +
                      '    <mct:input>Yes</mct:input>\n' +
                      '  </li>\n' +
                      '  <li>\n' +
                      '     <mct:input>No</mct:input>\n' +
                      '  </li>\n' +
                      '</ul>'
        },
        {
          'title': 'Input instructions',
          'description': $sce.trustAsHtml('Use the <code>instructions</code> class to let users know the expected input formatting.'),
          'response': 'And finally,<br>\n' +
                      '<strong>date of birth</strong>.\n' +
                      '<p class="instructions">\n' +
                      '  Use slashes to separate<br>\n' +
                      '  <code>(mm/dd/yyyy)</code>\n' +
                      '</p>\n'
        },
        {
          'title': 'Task summary list',
          'description': 'Use task lists for highlighting a set of items.',
          'response': 'Did you have any other questions today?\n\n' +
                      '<ul class="tasks title">\n' +
                      '  <li>\n' +
                      '    So far we have:\n' +
                      '  </li>\n' +
                      '</ul>\n' +
                      '<ul class="tasks">\n' +
                      '  <li>\n' +
                      '     Changed your personal belongings coverage\n' +
                      '  </li>\n' +
                      '</ul>\n' +
                      '<ul class="tasks">\n' +
                      '  <li>\n' +
                      '     Added your spouse to your home insurance policy\n' +
                      '  </li>\n' +
                      '</ul>\n' +
                      'Would you like to add your spouse to your other policies?'
        },
        {
          'title': 'Pipeline response',
          'description': $sce.trustAsHtml('Pipeline responses are automatically wrapped inside a <code>&lt;blockquote&gt;</code> tag to distinguish them from normal response text.'),
          'response': '<p class="highlight">Here\'s what I found;</p>\n' +
                      '<blockquote>\n' +
                      '  <h1>Actual Cash Value Coverage</h1>\n' +
                      '  Actual Cash Value Coverage pays to replace\n' +
                      '  the home or possessions minus a\n' +
                      '  <a href="http://google.com">deduction</a> for depreciation.\n' +
                      '  <ul>\n' +
                      '    <li>\n' +
                      '      There might be\n' +
                      '    </li>\n' +
                      '    <li>\n' +
                      '       lists as well.\n' +
                      '    </li>\n' +
                      '  </ul>\n' +
                      '  <feedback response-id="123"></feedback>\n' +
                      '</blockquote>\n' +
                      'Did you have any other questions today?'
        }
      ];
    };

  angular.module('styleguide.controller', [ 'ngRoute', 'ngSanitize', 'watson.avatar', 'styleguide.example', 'styleguide.colors' ])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/styleguide', {
          'templateUrl': 'modules/styleguide/styleguide.html',
          'controller': 'StyleGuideController',
          'controllerAs': 'sgCtrl'
        });
    })
    .controller('StyleGuideController', StyleGuideController);
}());
