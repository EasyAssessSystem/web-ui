var $ = require('jQuery');
window.$ = $;

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
                    EasyAssess.session = response.data;
                    buildSession();
                    $scope.authenticated = true;
                } else if (response.messages.length > 0) {
                    $scope.error = response.messages[0].message;
                }
            }).bind(this)
        ).error(function(){
            $scope.error = "登录失败";
        });


        function buildSession() {
            // component-permission map
            EasyAssess.session.componentPermissionMap = {};
            var authentication = EasyAssess.session.authentication;
            for (var i=0;i<authentication.length;i++) {
                var rolePermission = authentication[i];
                for (var j=0;j<rolePermission.permissions.length;j++) {
                    var permission = rolePermission.permissions[j];
                    if (!permission.component) continue;
                    var existingPermission = EasyAssess.session.componentPermissionMap[permission.component];
                    if (existingPermission) {
                        existingPermission = {
                            "get": permission.get || existingPermission.get,
                            "post": permission.post || existingPermission.post,
                            "put": permission.put || existingPermission.put,
                            "delete": permission.delete || existingPermission.delete,
                            "usablity": permission.usablity || existingPermission.usablity
                        };
                    } else {
                        EasyAssess.session.componentPermissionMap[permission.component] = {
                            "get": permission.get,
                            "post": permission.post,
                            "put": permission.put,
                            "delete": permission.delete,
                            "usability": permission.usability
                        };
                    }
                }
            }
        }
    };
});


