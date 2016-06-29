var EasyAssess = require('../easyassess.application');
EasyAssess.app.MyAssessmentDoneController = function($scope) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.MyAssessmentDoneController .prototype = EasyAssess.extend({
    _initialize: function($scope) {
        $scope.fields = [
            {title:"考评名称", field:"name", type:"string",searchable:true,default:true},
            {title:"开始日期", field:"startDate", type:"string",searchable:false,default:false},
            {title:"截止日期", field:"startDate", type:"string",searchable:false,default:false},
            {title:"发起人", field:"owner", type:"string",searchable:true,default:false},
        ];
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("myassessment_doneController", EasyAssess.app.MyAssessmentDoneController);