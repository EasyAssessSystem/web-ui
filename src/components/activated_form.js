var EasyAssess = require('../easyassess.application');
EasyAssess.app.ActivatedFormController = function($scope,$state) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.ActivatedFormController .prototype = EasyAssess.extend({
    _initialize: function($scope,$state) {
        $scope.fields = [
            {title:"考评名称", field:"formName", type:"string",searchable:true,default:true},
            {title:"状态",field:"status",type:"string",searchable:false,default:false},
            {title:"开始时间",field:"securedAssessment.startDate",searchable:false,default:false},
            {title:"结束时间",field:"securedAssessment.endDate",searchable:false,default:false},
            {title:"考评发起单位", field:"securedAssessment.ownerName", type:"string",searchable:false,default:false}
        ];

        this._statusMap = {
            "A": "未完成",
            "C": "评审中",
            "F": "已公布"
        };

        $scope.$on('submitted',function(){
            $scope.activeModel = null;
        })
    },

    _select: function(model) {
        if (model.status == "A") {
            this.$scope.activeModel = model;
        }
    },
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("activated_formController", EasyAssess.app.ActivatedFormController);