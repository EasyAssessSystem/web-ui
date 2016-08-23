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


        $scope.duration= '2';
        $scope.startDate = '2016-06-01';
        $scope.dates =[{date:'2016-06-05',formInfo:{id:1}},{date:'2016-06-07',formInfo:{id:2}},{date:'2016-07-05',formInfo:{id:3}},{date:'2016-08-05',formInfo:{id:5}}];

        $scope.getPlanForms = function(model){
            console.log('active model', model);
            $scope.duration= model.duration;
            $scope.startDate = model.startDate;
            var url = '';
            esRequestService.esGet(url).then(function(result){
                $scope.dates=result;
            });
            $scope.items[1].name = $scope.activeModel.name
        }



    },
    _restrict: function () {
    },

    _select: function (model) {
        this.$scope.activeModel = model;
        this.$scope.getPlanForms(model);
    }
}, EasyAssess.app.MaintenanceController.prototype);
EasyAssess.app.registerController("iqcformController", EasyAssess.app.IQCFormController);