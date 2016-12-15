var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCPlanController = function ($scope, esRequestService, $state, ngDialog) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCPlanController.prototype = EasyAssess.extend({
    _initialize: function ($scope, esRequestService, $state, ngDialog) {
        $scope.templateFields = [
            {title:"名称", field:"name", type:"string", searchable:true, default:true},
            {title:"创建人", field:"owner.name", type:"string", searchable:true, default:false}
        ];

        $scope.resource = "plan";

        this._showSaveMessage = true;
        this._service = EasyAssess.activeEnv.iqc();

        $scope.fields = [
            {title:"计划", field:"name", type:"string", searchable:true, default:true},
            {
                title: "操作",
                template: "plan_button_column.html",
                clickHandler: (function($index, model, $event) {
                    if ($($event.target).attr('es-id') == 'edit') {
                        $scope.activeModel = $scope.planModel = model;
                    } else if ($($event.target).attr('es-id') == 'delete') {
                        $scope.activeModel = model;
                        this._delete();
                    }
                }).bind(this)
            }
        ];

        $scope.new = function() {
            $scope.planModel = {
                id: null,
                items: [],
                name: "新建计划",
                records: [],
                owner: null
            };
        }

        $scope.save = (function() {
            $scope.activeModel = $scope.planModel;
            this._save();
        }).bind(this);

        $scope.back = function() {
            $scope.planModel = null;
        }

        $scope.$on('$templateLookup_selected', (function(e, model){
            ngDialog.openConfirm({
                template:'<div class="ngdialog-message">是否从模版复制创建质控计划?</div>'
                + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
                plain: true
            }).then(
              (function(){
                  var plan = {};
                  plan.id = null;
                  plan.owner = null;
                  plan.name = model.name;
                  plan.items = model.items;
                  plan.records = [];

                  esRequestService.esPost(EasyAssess.activeEnv.iqc() + "plan", plan)
                    .then(function(){
                        EasyAssess.QuickMessage.message("保存成功");
                        $scope.$broadcast('$refresh');
                  });
              }).bind(this)
            );
        }).bind(this));
    }
}, EasyAssess.app.MaintenanceController.prototype);
EasyAssess.app.registerController("iqcplanController", EasyAssess.app.IQCPlanController);