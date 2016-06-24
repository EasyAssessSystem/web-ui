var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssessmentDetailController = function($scope,$state,$stateParams) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.AssessmentDetailController .prototype = EasyAssess.extend({
    _initialize: function($scope, $stateParams) {
        $scope.assessment = $stateParams.data;
        $scope.fields = [
            {title:"机构名称", field:"name", type:"string",searchable:true,default:true},
            {title:"状态", field:"status", type:"string",searchable:false,default:false},
            {title:"分数", field:"scores", type:"string",searchable:false,default:false}
        ];

        $scope.participants = [];
        console.log(JSON.stringify($stateParams.params));
        for (var i=0;i<$scope.assessment.forms.length;i++) {
            $scope.participants.push({
                name:$scope.assessment.participants[$scope.assessment.forms[i].owner],
                status: "未提交"
            })
        }
    },

    _restrict: function() {
    },

    _select: function(model){
    }


}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessment_detailController", EasyAssess.app.AssessmentDetailController);