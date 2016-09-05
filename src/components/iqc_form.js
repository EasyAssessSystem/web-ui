var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCFormController = function($scope, esRequestService, $state, ngDialog) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCFormController.prototype = EasyAssess.extend({
    _initialize: function ($scope) {

        $scope.fields = [
            {title: "质控名称", field: "name", type: "string", searchable: true, default: true},
            {title: "开始日期", field: "startDate", type: "string", searchable: false, default: false},
            {title: "截止日期", field: "endDate", type: "string", searchable: false, default: false},
            {title: "发起人", field: "ownerName", type: "string", searchable: true, default: false},
            {title: "状态", field: "status", type: "string", searchable: true, default: false},
        ];

        $scope.currentMinistryId = EasyAssess.session.currentUser.ministries[0].id;

    },

    _select: function (model) {
        this.$state.current.data.plan = model;
        EasyAssess.TaskManager.start('iqc_form.detail', this.$state);
    }
}, EasyAssess.app.MaintenanceController.prototype);
EasyAssess.app.registerController("iqcformController", EasyAssess.app.IQCFormController);