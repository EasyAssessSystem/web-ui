var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCPlanMinistryFormsController = function ($scope, esRequestService, $state, ngDialog) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCPlanMinistryFormsController.prototype = EasyAssess.extend({
    _initialize: function ($scope, esRequestService, $state, ngDialog) {

        $scope.details = $state.current.data.details;

        $scope.items = [
            {
                name:'质控记录',
                bindfunc: backToPlan
            }
        ];

        var backToPlan = function(){
            $scope.items.pop();
            EasyAssess.TaskManager.start('plan',$state);
        };

        $scope.items[0].bindfunc = backToPlan;

        $scope.fields = [
            {title: "质控名称", field: "plan.name", type: "string", searchable: true, default: true},
            {title: "提交时间", field: "submitDate", type: "string", searchable: false, default: false},
            {title: "发起人", field: "ownerName", type: "string", searchable: true, default: false}
        ];
    },

    _select: function (model) {
        this.$state.current.data.result = model;
        EasyAssess.TaskManager.start('plan.forms.result', this.$state);
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("iqcplan_ministryformsController", EasyAssess.app.IQCPlanMinistryFormsController);