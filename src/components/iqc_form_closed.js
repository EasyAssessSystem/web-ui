var EasyAssess = require('../easyassess.application');
EasyAssess.app.IqcClosedFormController = function($scope,$state,$stateParams) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IqcClosedFormController .prototype = EasyAssess.extend({
    _initialize: function($scope,$state,$stateParams) {
        formAll = $stateParams.result;

        $scope.form = {
            values: formAll['values'],
            codes:formAll['codes'],
            formName:formAll['formName']
        };

        $scope.template = formAll.plan.template;
    }

}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("closed_iqcformController", EasyAssess.app.IqcClosedFormController);