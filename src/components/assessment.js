var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssessmentController = function($scope,esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.AssessmentController .prototype = EasyAssess.extend({
    _initialize: function($scope) {
        $scope.fields = [
            {title:"考评记录", field:"name", type:"string",searchable:true,default:true},
            {title:"参考单位", field:"libraries", type:"string",searchable:false,default:false},
            {title:"考评状态", field:"results", type:"string",searchable:false,default:false},
            {title:"操作",field:"actions",type:"string",searchable:false,default:false}
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
        }
    },
    _restrict: function() {
    },

    _select: function(model){
        this.$scope.activeModel = model;
        this.$scope.itemId = this.$scope.activeModel.id;
        this.$scope.detailFields = [
            {title:"机构名称", field:"name", type:"string",searchable:true,default:true},
            {title:"状态", field:"status", type:"string",searchable:false,default:false},
            {title:"操作", field:"actions", type:"string",searchable:false,default:false}
        ];


        this.$scope.detailOptions = this.$scope.detailFields.filter(function(eachfield){
            return eachfield.searchable;
        }).map(function(item){
            var option = {text:"",value:"",default:false};
            option.text = item.title;
            option.value = item.cascadeField ? item.cascadeField : item.field;
            option.default = item.default;
            return option;
        });
    }


}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessmentController", EasyAssess.app.AssessmentController);