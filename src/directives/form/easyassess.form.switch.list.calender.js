var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormSwitchListCalender"]
    = EasyAssess.app.directive("esFormSwitchListCalender", function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template:'<div>'
        +    '<div class="btn-group" role="group" style="float: right">'
        +        '<button type="button" class="btn btn-default btn-sm" style="margin: 0px;border-right: 0px;" ng-click="showCalender()">'
        +            '<span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>'
        +        '</button>'
        +        '<button type="button" class="btn btn-default  btn-sm" style="margin: 0px" ng-click="showList()">'
        +            '<span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>'
        +        '</button>'
        +    '</div>'
        +    '<div style="clear: both; padding-top: 10px" >'
        +        '<div ng-show="viewEnable"><es-app-fullcalendar es-duration="esCalenderDuration" es-start-date="esCalenderStartDate" es-plan="esCalenderPlan"></es-app-fullcalendar></div>'
        +        '<div ng-hide="viewEnable"><es-app-datagrid es-id="formlist" es-service="iqc" es-resource="{{esListResource}}" es-columns="esListColumns" es-options="esListOptions"></es-app-datagrid></div>'
        +    '</div>'
        +'</div>',

        scope: {
            esCalenderDuration:"@",
            esCalenderStartDate:"@",
            esCalenderPlan: "=",
            esListResource:"@",
            esListColumns:"=",
            esCalenderPlan:"=",
            esListOptions:"="
        },
        controller: ["$scope", function($scope){
            $scope.viewEnable = false;
            $scope.showCalender =function(){
                $scope.viewEnable = true;
            };
            $scope.showList =function(){
                $scope.viewEnable = false;
            }

            $scope.$on('formlist_selected',function(e,data){
                console.log('selected,list',data);
            })


        }]

    }
});
