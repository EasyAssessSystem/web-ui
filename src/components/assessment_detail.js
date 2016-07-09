var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssessmentDetailController = function($scope,$state,$stateParams, esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.AssessmentDetailController .prototype = EasyAssess.extend({
    _initialize: function($scope, $state) {
        $scope.assessment = $state.current.data.detail;
        $scope.activeModel = null;
        $scope.loading = false;
        $scope.assessname = $scope.assessment.name;
        $scope.fields = [
            {title:"机构名称", field:"name", type:"string",searchable:true,default:true},
            {title:"状态", field:"status", type:"string",searchable:false,default:false},
            {title:"分数", field:"scores", type:"string",searchable:false,default:false}
        ];

        var firstback = function(){
            EasyAssess.TaskManager.start('assessment',$state);
        };

        var secondback = function(){
        }

        $scope.items = [
            {
                name:'考评记录',
                bindfunc:firstback
            },
            {
                name:$scope.assessname,
                bindfunc:secondback
            }
        ];

        var self = this;
        $scope.show = function (form) {
            $scope.loading = true;
            self.esRequestService.esGet(EasyAssess.activeEnv.assess() + "template/" + form.securedAssessment.templateGuid).then(
                (function(result) {
                    $scope.loading = false;
                    $scope.activeModel = {
                        "template": result.data,
                        "form":form
                    }
                }).bind(this)
            );
        }
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessment_detailController", EasyAssess.app.AssessmentDetailController);