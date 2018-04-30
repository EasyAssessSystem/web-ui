var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppCalendar"]
    = EasyAssess.app.directive("esAppCalendar", function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template:'<div>'
        +'<date-picker ng-hide ="hideView" ng-model="esDate" on-date-selected="closeStartPop()" format-date="formatDate" style="position: absolute;right:15px;z-index: 999"></date-picker><input ng-model="esDate" ng-click="openDatePicker()" placeholder="{{esHolder}}"/>'
        + '</div>',
        scope: {
            esId:"@?",
            esHolder:"@",
            esDate: "@?"
        },
        controller: ["$scope", function($scope, $element, $attrs){
            $scope.hideView = true;
            if (!$scope.esDate) $scope.esDate = '';

            $scope.closeStartPop = function(){
                $scope.hideView = true;
                $scope.$emit('$' + $scope.esId + '_DateTimeSelected',{"value":$scope.esDate})
            };

            $scope.openDatePicker = function(){
                $scope.hideView = false;
            };


            $scope.formatDate = function (date) {
                function pad(n) {
                    return n < 10 ? '0' + n : n;
                }
                return date && date.getFullYear()
                    + '-' + pad(date.getMonth() + 1)
                    + '-' + pad(date.getDate());
            };
        }]
    }
});
