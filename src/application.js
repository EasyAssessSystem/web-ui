var angular = require('angular');
require('../node_modules/ng-dialog/css/ngDialog.min.css');
require('../node_modules/ng-dialog/css/ngDialog-theme-default.min.css');
require('../node_modules/ng-dialog/css/ngDialog-theme-plain.min.css');
require('../node_modules/ng-dialog/css/ngDialog-custom-width.css');
require('./css/es.theme.css')

var EasyAssess = require('./easyassess.application');
require('./directives/widget/easyassess.app.banner');
require('./directives/widget/easyassess.app.menu');
require('./directives/widget/easyassess.app.addbutton');
require('./directives/widget/easyassess.app.component');
require('./directives/control/easyassess.app.textbox');
require('./directives/control/easyassess.app.select');
require('./directives/control/easyassess.app.checkbox');
require('./directives/widget/easyassess.app.maint.buttongroup');
require('./directives/widget/easyassess.app.two.buttongroup');
require('./directives/widget/easyassess.app.filter');
require('./directives/widget/easyassess.app.datagrid');
require('./directives/widget/easyassess.app.lookup');

var app = angular.module("esApplication", [EasyAssess.app.name]);
app.controller("esApplicationController", function ($scope, $http) {
    $scope.input = {
        username: '',
        password: ''
    }

    $scope.logon = function () {
        $http.get(EasyAssess.activeEnv.pdm('default') + "user/session/" + $scope.input.username + "/" + $scope.input.password).success(
            (function (response) {
                if (response.result == "SUCC") {
                    $scope.authenticated = true;
                    EasyAssess.session = response.data;
                } else if (response.messages.length > 0) {
                    $scope.error = response.messages[0].message;
                }
            }).bind(this)
        ).error(function(){
            $scope.error = "登录失败";
        });
    };
});


