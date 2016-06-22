var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssessmentDetailController = function($scope,$state,$stateParams) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.AssessmentDetailController .prototype = EasyAssess.extend({
    _initialize: function($scope,$stateParams) {
        $scope.itemId = $stateParams.params.id;
        $scope.fields = [
            {title:"机构名称", field:"name", type:"string",searchable:true,default:true},
            {title:"状态", field:"status", type:"string",searchable:false,default:false},
            {title:"分数", field:"scores", type:"string",searchable:false,default:false}
        ];

        console.log('id is ',$scope.itemId);

    },
    _restrict: function() {
    },

    _select: function(model){
    }


}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessment_detailController", EasyAssess.app.AssessmentDetailController);