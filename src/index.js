	// global.jQuery = require('jquery');
	// require('bootstrap');

// require('../node_modules/bootstrap/dist/css/bootstrap.css');
var angular = require('angular');
require('../node_modules/angular-dropdowns/dist/angular-dropdowns.css');
require('../node_modules/ng-dialog/css/ngDialog.min.css');
require('../node_modules/ng-dialog/css/ngDialog-theme-default.min.css');
require('../node_modules/ng-dialog/css/ngDialog-theme-plain.min.css');
require('../node_modules/ng-dialog/css/ngDialog-custom-width.css');
require('./css/es.theme.css')

var EasyAssess = require('./easyassess.application');
console.log(EasyAssess);
require('./directives/widget/easyassess.app.banner');
require('./directives/widget/easyassess.app.menu');
require('./directives/widget/easyassess.app.component');
require('./directives/widget/easyassess.app.textbox');
require('./directives/widget/easyassess.app.select');
require('./directives/widget/easyassess.app.maint.buttongroup');
require('./directives/widget/easyassess.app.filter');
require('./directives/widget/easyassess.app.datagrid');


 var app = angular.module("esApplication",[EasyAssess.app.name]);
 app.controller("esApplicationController", function($scope) {
 });

 /*var testApp = require('./directives/testApp');
 require('./directives/widget/testAppDirect');
 console.log(testApp.app.name);
 var app = angular.module("App",[testApp.app.name]);
*/

