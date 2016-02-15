<<<<<<< HEAD
Watson Engagement Advisor Accelerator App
===================

# Table of contents

* [Getting started](#getting-started)
  * [Deploying](#deploying)
* [Architecture](#architecture)
* [Modules](#modules)
  * [dialog](#dialog)
     * [Response templates, components and text styles](#response-templates-components-and-text-styles)
     * [Creating custom components](#creating-custom-components)
  * [guidance](#guidance)
  * [quit](#quit)
  * [intro](#intro)
  * [util](#util)
  * [styleguide](#styleguide)
  * [examples](#examples)
* [Developing](#developing)

Watson Engagement Advisor Accelerator App enables users to interact with a Watson Engagement Advisor (WEA) instance using the `conversation` API. Its appearance can be customized and it can be configured to use a client-specific Watson Experience Manager endpoint.

# Getting started

### System requirements

 * a web server
 * access to a Watson Experience Manager instance

### Browser compatibility

The application has been tested on the following browser platforms:

##### Desktop

| Chrome        | Firefox       | Internet Explorer | Opera | Safari |
| :-----------: |:-------------:| :---------------: | :---: | :----: |
| 41            | 36            | 11                | 28    | 8      |

##### Mobile

| Android       | Safari Mobile |
| :-----------: | :-----------: |
| 4.4           | 7.1           |

## Deploying

The following steps are required to deploy the application.

1. [Configure](#configure) server-specific settings
2. [Customize](#customize) the appearance and texts _(optional)_
3. [Build](#build) the distributable
4. [Upload](#upload) the app to a web server

### Prerequisites

First, install [node.js](https://nodejs.org). Then run the following commands to install the dependencies and build tools:

	$ npm install -g gulp
	$ npm install

For SCSS linting, `scss-lint` Ruby gem is also required:

	$ gem install scss-lint

### <a name="configure"></a>Configuring server-specific settings

Edit `wea-config.json` to configure server-specific settings.
Make sure to edit the settings for the correct environment; for example, if building a production distributable, edit the settings for `production` environment.


| Setting | Description | Example value |
| ------- | ----------- | ------------- |
| `WEA_API_URL` | _(required)_ <br> The URL of a WEA API server. | `http://server...com/instance/watson/wea/v2` |
| `WEA_API_TOKEN` | _(required with `WEA_API_URL`)_ <br> The value to set as the `user_token` header in API requests. | `wea-example` |

### <a name="customize"></a>Customize the appearance and texts

Any static texts in the application (such as the input field placeholders) can be configured by editing `po/en_US.po` file using either a text editor or a `.po` file editor such as [poedit](http://www.poedit.net/).

Application styles and colors can be changed by editing `app/styles/_overrides.scss` using a text editor. See the code comments in the file for more details.

### <a name="build"></a>Building a distributable

	$ gulp [--target local|develop|demo|production]

The `target` argument optionally specifies the deployment environment (defaults to `local`). The distributable gets built to the `dist/` folder.

### <a name="upload"></a>Upload the app to a web server

After having [built](#build) the distributable, upload the contents of `dist/` folder to a web server.


# Architecture
WEA Accelerator App connects to the WEA API to send questions and receive responses from Watson.

    +-----------+           +-----------------------+
    |  WEA API  | <-------> |  WEA Accelerator App  |
    +-----------+           +-----------------------+

### Files

```
wea/
 app/
   images/
   modules/          # application modules
     dialog/
     examples/
     guidance/
     intro/
     quit/
     styleguide/
     util/
   styles/           # SCSS style sheets
   vendor/           # any third-party components
   app.js            # application root JS
   index.html        # application root HTML
  gulpfile.js        # build task descriptions
  wea-config.json    # configuration settings
```

# Modules

The application code is divided into several modules which consist of one or more components. For example, the `guidance` module contains a component for showing the Guidance ("Helpful Links") drawer. The following modules are built-in into the application:

* [dialog](#dialog)
* [guidance](#guidance)
* [quit](#quit)
* [intro](#intro)
* [util](#util)
* [styleguide](#styleguide)
* [examples](#examples)


## <a name="dialog"></a>Dialog module
The Dialog module is responsible for managing and displaying the conversation between the user and Watson (WEA API). It sends user's messages to the API and parses & displays the responses it receives.

### Response templates, components and text styles

The Dialog module also has built-in support for several response template styles and components that can be used within the responses. See [styleguide](#styleguide) for live illustrations of the templates and components. The styleguide also contains examples of supported text styles that can be used to format the responses.

#### Built-in templates
A response template gets triggered if a matching style class is found in the response. Currently supported templates are `summary`, `confirmation`, `transition` and `default`. To use a specific template in a response, include the template's name in the `class` attribute of the response root element. Also include the class `full-screen` to declare that the template should occupy the entire screen:

```html
<div class="transition full-screen">
...
</div>
```

#### Built-in components
##### `<mct:input>`
Displays a clickable element that submits it's value as the next message to WEA API.
##### `<mct:autolearnitems>`
Displays a list of clickable elements that submit their value as the next message to WEA API.
##### `<mct:select>`
Displays a dropdown selector that submits the selected value as the next message to WEA API.
##### `<mct:datetime>`
Displays a date & time picker that submits the selected date as the next message to WEA API.
##### `<mct:avatar>`
Displays the default avatar image.
##### `<mct:question>`
The content of this tag is displayed as-is and also used as the question text shown to the user in the input screen.
##### `<mct:pre-submit>`
The content of this tag is **not** shown to the user. Instead, it is sent as a message to the API immediately before the user's next message.
##### `<mct:feedback>`
Displays a _"Did this answer your question?"_ feedback question with Yes/No options and sends the response to WEA `/feedback` API. Automatically added to real pipeline responses, but can be added manually to fake pipeline responses as well.

### Creating custom components

In addition to using the built-in ones, it is possible to create custom components. Generally speaking, creating a custom component consists of three steps: 

1. creating the [response markup](#response-markup)
2. [transforming](#transform) it to renderable HTML + logic
3. [presenting](#presentation) the component to the user.

#### Response markup
The component markup to be used inside a Dialog response node can be basically arbitrary. WEA Accelerator App currently namespaces all custom component tags with `mct`, which is also the default namespace of custom elements used inside Dialog itself.

For example, `<mct:input>` is a component that submits it's contents back to the API as a response:

```html
<ul class="bubbles">
   <li>
     <mct:input>Yes</mct:input>
   </li>
   <li>
     <mct:input>No</mct:input>
   </li>
</ul>
```

#### Transform
When a response is received from Dialog, it is parsed and transformed to produce the HTML to be rendered along with any JavaScript logic required for the desired functionality. For instance, the above `<mct:input>` example could be transformed into the following HTML:

```html
<ul class="bubbles">
   <li>
     <span class="autoinput" onclick="myFunction()">Yes</span>
   </li>
   <li>
     <span class="autoinput" onclick="myFunction()">No</span>
   </li>
</ul>
```
where `myFunction` is a function submitting the contents of the element to the API. In practice, component markup and logic is encapsulated using AngularJS directives:

##### Using AngularJS directives to encapsulate components
The WEA Accelerator App uses AngularJS directives to encapsulate markup and logic of a component. For example, the `mct:input` markup is first transformed to a directive called `autoinput`, which is implemented as

```javascript
angular.module('dialog.component.autoinput', ['dialog.service'])
  .directive('autoinput', function (dialogService) {
    return {
      'restrict': 'E',
      'transclude': true,
      'replace': true,
      'template': '<span class="autoinput" ng-transclude></span>',
      'link': function (scope, element) {
        var text = element.text();
        element.bind('click', function (e) {
          dialogService.query(text);
        });
      }
    };
  });
```

See `app/modules/dialog/dialog-parser-service.js` for examples on parsing response components.

#### Presentation
The custom components can be styled using arbitrary CSS rules. In the WEA demo app, for example, an `<autoinput>` component inside a `<ul class="bubbles">` list is rendered as a circle-shaped button.

## <a name="guidance"></a>`guidance` module

This module contains a `<guidance>` component for displaying the "Helpful Links" drawer. See `app/modules/dialog/dialog.html` for a usage example.

## <a name="quit"></a>`quit` module

This module contains a `<quit>` component for displaying the quit icon and, when user clicks on the icon, an overlay containing Quit / Cancel buttons. See `app/modules/dialog/dialog.html` for a usage example.

## <a name="intro"></a>`intro` module

The `intro` module contains the introductory animation sequence displayed when user first loads the application.

## <a name="util"></a>`util` module

This module contains generic helper components.

## <a name="styleguide"></a>`styleguide` module

The `styleguide` module contains a page showcasing the various templates and styles used throughout the application. It also allows live editing of the templates to preview changes in responses. Browse to `/#/styleguide` in the deployed application to view the styleguide page.

## <a name="examples"></a>`examples` module

The `examples` module contains an example in-app landing page for the imaginary Flexrate insurance company mainly for demoing purposes. In a real-life scenario the landing page would likely reside outside of the application. Browse to `/#/examples/flexrate` in the deployed application to view the page.

---

# Developing

### Running

    $ gulp serve


### Running tests

	$ gulp test

for running tests once, or

	$ gulp autotest

for running the tests whenever a source file changes.

### Linting

	$ gulp lint

for linting once, or

	$ gulp autolint

for linting whenever a source file changes.
=======
# wea-ui-accelerator
>>>>>>> 9f9cada4970d83493b7fb6543cac1d17af6fcb51
