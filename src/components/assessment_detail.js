var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssessmentDetailController = function($scope,$state,$stateParams) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.AssessmentDetailController .prototype = EasyAssess.extend({
    _initialize: function($scope, $state) {
        $scope.assessment = $state.current.data.detail;
        console.log($scope.assessment);
        $scope.assessname = $scope.assessment.name;
        $scope.fields = [
            {title:"机构名称", field:"name", type:"string",searchable:true,default:true},
            {title:"状态", field:"status", type:"string",searchable:false,default:false},
            {title:"分数", field:"scores", type:"string",searchable:false,default:false}
        ];

        $scope.participants = [];
        for (var i=0;i<$scope.assessment.forms.length;i++) {
            $scope.participants.push({
                name:$scope.assessment.participants[$scope.assessment.forms[i].owner],
                status: "未提交"
            })
        }

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
            }]



    },




    _restrict: function() {
    },

    _select: function(model){
    }


}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessment_detailController", EasyAssess.app.AssessmentDetailController);