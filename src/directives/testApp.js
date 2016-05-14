var angular = require('angular');

var testApp={};

testApp.app = angular.module('TestAPPModule',[require('ng-dialog')],function(){
});

module.exports = testApp;