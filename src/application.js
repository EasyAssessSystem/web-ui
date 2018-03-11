var $ = require('jquery');
window.$ = $;

var angular = require('angular');
require('../node_modules/angular-cookies/angular-cookies.min');
require('../node_modules/ng-dialog/css/ngDialog.min.css');
require('../node_modules/ng-dialog/css/ngDialog-theme-default.min.css');
require('../node_modules/ng-dialog/css/ngDialog-theme-plain.min.css');
require('../node_modules/ng-dialog/css/ngDialog-custom-width.css');
require('../node_modules/angular-ui-tree/dist/angular-ui-tree.min.css');
require('../node_modules/angular-date-picker/angular-date-picker.css');
require('./css/es.theme.css');
require('./css/angular-ui-tree.css');
require('../node_modules/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css');

var EasyAssess = require('./easyassess.application');

require('./services/easyassess.requestservice');

require('./directives/widget/easyassess.app.banner');

require('./directives/widget/easyassess.app.menu');
require('./directives/widget/easyassess.app.addbutton');
require('./directives/widget/easyassess.app.component');
require('./directives/widget/easyassess.app.ministry.bar');
require('./directives/control/easyassess.app.textbox');
require('./directives/control/easyassess.app.select');
require('./directives/control/easyassess.app.checkbox');
require('./directives/widget/easyassess.app.maint.buttongroup');
require('./directives/widget/easyassess.app.filter');
require('./directives/widget/easyassess.app.datagrid');
require('./directives/widget/easyassess.app.lookup');
require('./directives/widget/easyassess.app.wizard');
require('./directives/widget/easyassess.app.breadcrumb');
require('./directives/widget/easyassess.app.fullcalendar');
require('./directives/widget/easyassess.app.tabs');
require('./directives/widget/easyassess.app.ajax.downloader');

require('./directives/form/easyassess.form.textbox');
require('./directives/form/easyassess.form.group.editable');
require('./directives/form/easyassess.form.expect.option');
require('./directives/form/easyassess.iqcform.expect.option');
require('./directives/form/easyassess.form.group.specimens');
require('./directives/form/easyassess.form.addbutton');
require('./directives/form/easyassess.form.header');
require('./directives/form/easyassess.form.footer');
require('./directives/form/easyassess.form.group');
require('./directives/form/easyassess.form.page');
require('./directives/form/easyassess.form.result');
require('./directives/form/easyassess.form.submit');
require('./directives/form/easyassess.form.switch.list.calender');
require('./directives/charts/easyassess.chart.doughnut');
require('./directives/widget/easyassess.app.calendar');
require('./directives/widget/easyassess.app.history.buttons');
require('./directives/widget/easyassess.app.datepicker');
require('./directives/form/easyassess.form.iqc.plan');
require('./directives/form/easyassess.form.iqc.editor');
require('./directives/form/easyassess.form.iqc.viewer');
require('./directives/form/easyassess.form.iqc.chart');
require('./directives/form/easyassess.form.iqc.details');
require('./directives/form/easyassess.form.iqc.history.grid');
require('./directives/form/easyassess.form.iqc.plan.summary');
require('./directives/form/easyassess.form.iqc.statistic.comparison.chart');
require('./directives/form/easyassess.form.iqc.statistic.comparison.grid');
require('./directives/form/easyassess.form.notice');
require('./directives/form/easyassess.form.notice.editor');

var app = angular.module("esApplication", [EasyAssess.app.name, "ngCookies"]);

app.controller("esApplicationController", function ($scope, $http, $cookies,$state) {
    $scope.input = {
        username: '',
        password: ''
    };
    $scope.logon = function () {
        $http.get(EasyAssess.activeEnv.pdm('default') + "user/session/" + $scope.input.username + "/" + $scope.input.password).success(
            (function (response) {
                if (response.result == "SUCC") {
                    EasyAssess.session = response.data;
                    buildSession();
                    $scope.authenticated = true;
                    EasyAssess.TaskManager.start("notices", $state)
                } else if (response.messages.length > 0) {
                    $scope.error = response.messages[0].message;
                }
            }).bind(this)
        ).error(function(){
            $scope.error = "登录失败";
        });


        function buildSession() {
            $cookies.put("SESSION", EasyAssess.session.sessionKey);

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

            // TO-DO
            EasyAssess.session.componentPermissionMap["notices"] = {
                "get": true,
                "post": true,
                "put": true,
                "delete": true,
                "usablity": true
            };
        }
    };
});


if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function(predicate) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            var len = o.length >>> 0;
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var thisArg = arguments[1];
            var k = 0;
            while (k < len) {
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                k++;
            }
            return undefined;
        }
    });
}


