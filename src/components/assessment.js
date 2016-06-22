var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssessmentController = function($scope,esRequestService,$state,ngDialog) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.AssessmentController .prototype = EasyAssess.extend({
    _initialize: function($scope,esRequestService,$state,ngDialog) {
        $scope.fields = [
            {title:"考评记录", field:"name", type:"string",searchable:true,default:true},
            {title:"参考单位", field:"libraries", type:"string",searchable:false,default:false},
            {title:"考评状态", field:"results", type:"string",searchable:false,default:false},
            {title:"操作",field:"actions",type:"string",searchable:false,default:false,template:true,text:"Finalise"}
        ];
        $scope.data = [300, 500, 100];
        $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];

        $scope.data2 = [400, 600, 200];
        $scope.labels2 = ["Download Sales2", "In-Store Sales2", "Mail-Order Sales2"];

        $scope.linelabels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.lineseries = ['Series A', 'Series B'];
        $scope.linedata = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];

        $scope.itemId = "";
        $scope.goback = function(){
            $scope.activeModel = null;
        };

        $scope.$on('$btnClick',function(){
            ngDialog.openConfirm({
                template:   '<div class="ngdialog-message">是否确定要结束这次考评</div>'
                + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
                plain: true
            })
        });

        $scope.startNewAssessment = function(){
            EasyAssess.TaskManager.start('start_assessment', $state);
        }
    },
    _restrict: function() {
    },

    _select: function(model){
        stateOptions = {
            url:"/:id",
            templateUrl:  'assessment.detail.html',
            controller: "assessment_detailController"
        };
        EasyAssess.TaskManager.start('assessment.detail',this.$state,stateOptions,{id:model.id});
        console.log('statenow is ',this.$state.current);

    }


}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessmentController", EasyAssess.app.AssessmentController);