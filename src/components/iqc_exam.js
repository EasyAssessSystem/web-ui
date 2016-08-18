var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCExamController = function ($scope, esRequestService, $state, ngDialog) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCExamController.prototype = EasyAssess.extend({
    _initialize: function ($scope, esRequestService, $state, ngDialog) {
        $scope.doFinalize = false;
        $scope.events = [
            {
                title: 'Event 1',
                startsAt: new Date(2013,5,1,1)
            },
            {
                title: 'Event 2',
                startsAt: new Date(2014,8,26,15)
            }
        ];

        $scope.calendarView = 'month';
        $scope.viewDate = new Date();

        $scope.fields = [
            {title: "质控名称", field: "name", type: "string", searchable: true, default: true},
            {title: "开始日期", field: "startDate", type: "string", searchable: false, default: false},
            {title: "截止日期", field: "endDate", type: "string", searchable: false, default: false},
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
        EasyAssess.TaskManager.start('assessment.detail', this.$state);
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("iqcexamController", EasyAssess.app.IQCExamController);