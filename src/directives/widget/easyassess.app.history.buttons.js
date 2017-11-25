var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppHistoryButtons"]
    = EasyAssess.app.directive("esAppHistoryButtons", function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div>'
        +'<ol ng-if="hasHistory() && false" class="breadcrumb">'
        +'<li ng-click="back()"><a href="#">' + EasyAssess.lang.widgets.history.backText + '</a></li>'
        +'</ol>'
        +'</div>',
        scope: {

        },
        controller: ["$scope", function ($scope, $element, $attrs) {
            $scope.back = function() {
                EasyAssess.TaskManager.back();
            }

            $scope.hasHistory = function() {
                return EasyAssess.TaskManager.getHistory().length > 1;
            }
        }]
    };
});
