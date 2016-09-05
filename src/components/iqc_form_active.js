var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCActivatedFormController = function($scope,$state,esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCActivatedFormController.prototype = EasyAssess.extend({
    _initialize: function($scope,$state,esRequestService) {

        $scope.plan = $state.current.data.plan;

        $scope.activeModel = {id:-1,template:$scope.plan.template,formName:$scope.plan.name};

        $scope.$on('submitted',function(e,data){
            var url = EasyAssess.activeEnv['iqc']() + 'form';
            var result = {
                "plan":{
                    "id":$scope.plan.id
                },
                "values":data['values'],
                "codes":data['codes']
            };

            esRequestService.esPost(url,result).then(function(data){
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