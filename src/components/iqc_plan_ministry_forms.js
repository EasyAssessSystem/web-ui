var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCPlanMinistryFormsController = function ($scope, esRequestService, $state, ngDialog) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCPlanMinistryFormsController.prototype = EasyAssess.extend({
    _initialize: function ($scope, esRequestService, $state, ngDialog) {

        $scope.ministry = $state.current.data.ministry;


        var secondback = function(){
            EasyAssess.TaskManager.start('plan.ministry',$state);
        };

        console.log($scope.items);
        $scope.items[1].bindfunc = secondback;

        $scope.items.push({
            name:$scope.ministry.name,
            bindfunc:function(){}
        });


        $scope.fields = [
            {title: "质控名称", field: "name", type: "string", searchable: true, default: true},
            {title: "提交时间", field: "startDate", type: "string", searchable: false, default: false},
            {title: "发起人", field: "ownerName", type: "string", searchable: true, default: false},
            {title: "状态", field: "status", type: "string", searchable: true, default: false},
        ];
        this._statusMap = {
            "A": "进行中",
            "F": "已完成"
        };

    },
    _restrict: function () {
    },

    _select: function (model) {
        this.$state.current.data.detail = model;
        EasyAssess.TaskManager.start('plan.ministry.forms.detail', this.$state);
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("iqcplan_ministryformsController", EasyAssess.app.IQCPlanMinistryFormsController);