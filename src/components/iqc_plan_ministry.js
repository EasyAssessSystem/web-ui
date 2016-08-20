var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCPlanMinistryController = function ($scope, esRequestService, $state, ngDialog) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCPlanMinistryController.prototype = EasyAssess.extend({
    _initialize: function ($scope, esRequestService, $state, ngDialog) {

        //$scope.plan = $state.current.data.detail;

        $scope.plan = {name:"2016陕西质控"};
        $scope.planName = $scope.plan.name;

        $scope.ministryFields =[
            {title: "机构名称", field: "name", type: "string", searchable: true, default: true}
        ];

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

    },
    _restrict: function () {
    },

    _select: function (model) {
        this.$state.current.data.detail = model;
        EasyAssess.TaskManager.start('plan.ministry.forms', this.$state);
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("iqcplan_ministryController", EasyAssess.app.IQCPlanMinistryController);