var EasyAssess = require('../easyassess.application');
EasyAssess.app.ClosedFormController = function($scope, esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.ClosedFormController .prototype = EasyAssess.extend({
    _initialize: function($scope) {
        $scope.loading = false;
        $scope.activeModel = null;
        $scope.fields = [
            {title:"考评名称", field:"formName", type:"string",searchable:true,default:true},
            {title:"状态",field:"status",type:"string",searchable:false,default:false},
            {title:"提交日期", field:"submitDate", type:"string",searchable:false,default:false},
            {title:"分数", field:"totalScore", type:"string",searchable:false,default:false},
            {title:"考评发起单位", field:"securedAssessment.ownerName", type:"string",searchable:false,default:false},
            {
                title: "操作",
                template: "form_action_column.html",
                clickHandler: (function ($index, model, $event) {
                    if ($($event.target).attr('es-id') == 'export') {
                        window.open(EasyAssess.activeEnv.assess() + "form/excel/" + model.id)
                    }
                }).bind(this)
            }
        ];

        this._statusMap = {
            "A": "未完成",
            "C": "评审中",
            "F": "已公布"
        };
    },

    _postSelect: function(model) {
        this.$scope.loading = true;
        this.esRequestService.esGet(EasyAssess.activeEnv.assess() + "template/" + model.securedAssessment.templateGuid).then(
            (function(result) {
                this.$scope.loading = false;
                this.$scope.template = result.data;
            }).bind(this)
        );
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("closed_formController", EasyAssess.app.ClosedFormController);