var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esDatePicker"]
    = EasyAssess.app.directive("esDatePicker", function() {

    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template:   '<div class="input-group" style="width: 200px;">'
                    +	'<span ng-bind="esModel" ng-dblclick="clearDatePicker()" style="width: 200px; height: 20px; display: block; cursor: pointer;" class="es-form-signature-line"></span>'
                    +	'<span class="input-group-addon" ng-click="toggle()" style="padding: 0px 0px 0px 0px;cursor: pointer;"><span class="glyphicon glyphicon-calendar"></span></span>'
                    +	'<date-picker ng-model="esModel" ng-hide="hideDatePicker" style="position: absolute;top:45px;z-index: 999" on-date-selected="dateSelected()" format-date="formatDate"></date-picker>'
                    +'</div>',
        scope: {
            esModel:"="
        },
        controller: ["$scope", function($scope, $element, $attrs){
            $scope.hideDatePicker = true;

            $scope.formatDate = function (date) {
                function pad(n) {
                    return n < 10 ? '0' + n : n;
                }
                return date && date.getFullYear()
                    + '-' + pad(date.getMonth() + 1)
                    + '-' + pad(date.getDate());
            };

            $scope.dateSelected = function () {
                $scope.hideDatePicker = true;
            };

            $scope.toggle = function () {
                $scope.hideDatePicker = !$scope.hideDatePicker;
            };
            
            $scope.clearDatePicker = function () {
                $scope.esModel = null;
            }
        }]
    }

});
