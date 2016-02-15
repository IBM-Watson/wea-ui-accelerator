(function () {
  'use strict';
  // A utility module for allowing injecting lodash as a dependency
  angular.module('lodash', []).constant('_', window._);
}());
