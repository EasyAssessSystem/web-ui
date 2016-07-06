var EasyAssess = require('../easyassess.application');
EasyAssess.app.MyAssessmentDoneController = function($scope, esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.MyAssessmentDoneController .prototype = EasyAssess.extend({
    _initialize: function($scope) {
        $scope.loading = false;
        $scope.activeModel = null;
        $scope.fields = [
            {title:"考评名称", field:"formName", type:"string",searchable:true,default:true},
            {title:"提交日期", field:"submitDate", type:"string",searchable:false,default:false},
            {title:"分数", field:"totalScore", type:"string",searchable:false,default:false},
            {title:"考评发起单位", field:"assessmentOwnerName", type:"string",searchable:false,default:false},
        ];
    },

    _postSelect: function(model) {
        this.$scope.loading = true;
        this.esRequestService.esGet(EasyAssess.activeEnv.assess() + "template/" + model.templateId).then(
            (function(result) {
                this.$scope.loading = false;
                this.$scope.template = result.data;
            }).bind(this)
        );
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("myassessment_doneController", EasyAssess.app.MyAssessmentDoneController);