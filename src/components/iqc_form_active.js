var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCActivatedFormController = function($scope,$state) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCActivatedFormController.prototype = EasyAssess.extend({
    _initialize: function($scope,$state) {

        $scope.plan = $state.current.data.plan;

        $scope.activeModel = {id:-1,template:$scope.plan.template,formName:$scope.plan.name};

        $scope.$on('submitted',function(data){
            var url = EasyAssess.activeEnv['iqc']() + 'form/' + $scope.plan.id;

            // need to decide what to send
            esRequestService.esPut(url, {"values":$scope.answer.values,"codes":$scope.answer.codes}).then(function(res){
                EasyAssess.TaskManager.start('iqc_form', $state);
            });
        })
    },

    _select: function(model) {
        if (model.status == "A") {
            this.$scope.activeModel = model;
        }
    },
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("activated_iqcformController", EasyAssess.app.IQCActivatedFormController);