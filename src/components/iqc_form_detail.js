var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCFormDetailController = function ($scope, esRequestService, $state, ngDialog) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCFormDetailController.prototype = EasyAssess.extend({
    _initialize: function ($scope, esRequestService, $state) {

        activePlan = $state.current.data.plan;

        $scope.fields = [
            {title: "质控名称", field: "formName", type: "string", searchable: true, default: true},
            {title: "提交时间", field: "submitDate", type: "string", searchable: false, default: false},
            {title: "发起人", field: "ownerName", type: "string", searchable: true, default: false},
            {title: "状态", field: "status", type: "string", searchable: true, default: false},
        ];

        this._statusMap = {
            "A": "进行中",
            "F": "已完成"
        };

        $scope.currentMinistryId = EasyAssess.session.currentUser.ministries[0].id;

        var firstback = function(){
            EasyAssess.TaskManager.start('iqc_form', $state);
        };

        var secondback = function(){
        };

        $scope.items = [
            {
                name:'我的质控',
                bindfunc:firstback
            },
            {
                name:activePlan.name,
                bindfunc:secondback
            }
        ];

        $scope.duration= String(activePlan.duration);
        $scope.startDate = activePlan.startDate;
        $scope.plan = {planId:activePlan.id,ministryId:$scope.currentMinistryId};
        $scope.uri = 'form/' + activePlan.id +'/'+ $scope.currentMinistryId + '/list';

        $scope.goToAnswer = function(){
            EasyAssess.TaskManager.start('iqc_form.answer', $state);
        };

        $scope.$on('clicked_form',function(e,data){
            EasyAssess.TaskManager.start('iqc_form.result',$state,null,{result:data});
        });

        $scope.$on('$formlistselected',function(e,data){
            EasyAssess.TaskManager.start('iqc_form.result',$state,null,{result:data});
        })
    }

}, EasyAssess.app.MaintenanceController.prototype);
EasyAssess.app.registerController("iqcformDetailController", EasyAssess.app.IQCFormDetailController);