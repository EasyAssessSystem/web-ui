var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCPlanMinistryController = function ($scope, esRequestService, $state, ngDialog) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCPlanMinistryController.prototype = EasyAssess.extend({
    _initialize: function ($scope, esRequestService, $state, ngDialog) {

        $scope.plan = $state.current.data.detail;
        $scope.planName = $scope.plan.name;

        $scope.health_ministries = [];
        angular.forEach($scope.plan.participants,function(value,key){
            var health_item = {
                "id":key,
                "name":value
            };
            $scope.health_ministries.push(health_item);
        });

        var firstback = function(){
            EasyAssess.TaskManager.start('plan',$state);
        };

        var secondback = function(){
        };

        $scope.items = [
            {
                name:'质控记录',
                bindfunc:firstback
            },
            {
                name:$scope.planName,
                bindfunc:secondback
            }
        ];

        $scope.show = function(item){
            $state.current.data.ministry = item;
            EasyAssess.TaskManager.start('plan.ministry.forms', $state);
        }

    },
    _restrict: function () {
    },

    _select: function () {
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("iqcplan_ministryController", EasyAssess.app.IQCPlanMinistryController);