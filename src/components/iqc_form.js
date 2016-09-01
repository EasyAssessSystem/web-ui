var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCFormController = function ($scope, esRequestService, $state, ngDialog) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCFormController.prototype = EasyAssess.extend({
    _initialize: function ($scope, esRequestService, $state, ngDialog) {

        $scope.fields = [
            {title: "质控名称", field: "name", type: "string", searchable: true, default: true},
            {title: "开始日期", field: "startDate", type: "string", searchable: false, default: false},
            {title: "截止日期", field: "endDate", type: "string", searchable: false, default: false},
            {title: "发起人", field: "ownerName", type: "string", searchable: true, default: false},
            {title: "状态", field: "status", type: "string", searchable: true, default: false},
        ];

        this._statusMap = {
            "A": "进行中",
            "F": "已完成"
        };


        $scope.currentMinistryId = EasyAssess.session.currentUser.ministries[0].id;

        var firstback = function(){
            $scope.activeModel = null
        };

        var secondback = function(){
        };

        $scope.items = [
            {
                name:'我的质控',
                bindfunc:firstback
            },
            {
                name:'test',
                bindfunc:secondback
            }
        ];


        //$scope.duration= '4';
        //$scope.startDate = '2016-06-01';
        //$scope.dates =[{date:'2016-06-05',formInfo:{id:1}},{date:'2016-06-07',formInfo:{id:2}},{date:'2016-07-05',formInfo:{id:3}},{date:'2016-08-05',formInfo:{id:5}}];

        $scope.getPlanForms = function(model){
            $scope.duration= String(model.duration);
            $scope.startDate = model.startDate;
            var url = EasyAssess.activeEnv['iqc']() + 'form/'+ model.id+'/' + $scope.currentMinistryId + '/list';
            esRequestService.esGet(url).then(function(data){
                $scope.dates=data.data.content;
                $scope.activeModel = model;
                $scope.items[1].name = $scope.activeModel.name;
            });
        };

        $scope.$on('clicked_form',function(date){
            console.log('clicked!')
        });

        $scope.goToAnswer = function(){
            $state.current.data.plan = $scope.activeModel;
            EasyAssess.TaskManager.start('iqc_form.answer', $state);
        };


        $scope.$on('closedAnswer',function(data){

        });

        $scope.$on('activeAnswer',function(data){
            EasyAssess.TaskManager.start('iqc_form.answer', $state);
        })

    },
    _restrict: function () {
    },

    _select: function (model) {
        this.$scope.getPlanForms(model);
    }
}, EasyAssess.app.MaintenanceController.prototype);
EasyAssess.app.registerController("iqcformController", EasyAssess.app.IQCFormController);