/**
 * Created by dongchen on 6/10/16.
 */
var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esChartDoughunt"]
    = EasyAssess.app.directive("esChartDoughunt", function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template: '<canvas id="doughnut" class="chart chart-doughnut" chart-data="esChartLabel" chart-labels="esChartLabel"></canvas>',
        scope: {
            esChartModel: "=",
            esChartLabel:"="
        },
        controller: ["$scope", function($scope, $element, $attrs){
        }]
    }
});
