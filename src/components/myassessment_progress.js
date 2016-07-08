var EasyAssess = require('../easyassess.application');
EasyAssess.app.MyAssessmentProgressController = function($scope,$state) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.MyAssessmentProgressController .prototype = EasyAssess.extend({
    _initialize: function($scope,$state) {
        $scope.fields = [
            {title:"考评名称", field:"formName", type:"string",searchable:true,default:true},
            {title:"状态",field:"status",type:"string",searchable:false,default:false},
            {title:"开始时间",field:"securedAssessment.startDate",searchable:false,default:false},
            {title:"结束时间",field:"securedAssessment.endDate",searchable:false,default:false},
            {title:"参评机构", field:"ownerName", type:"string",searchable:true,default:false}
        ];

    },
    _select: function(model){
        this.$state.current.data.detail = model;
        EasyAssess.TaskManager.start('myassessment.progress.answer',this.$state);
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("myassessment_progressController", EasyAssess.app.MyAssessmentProgressController);