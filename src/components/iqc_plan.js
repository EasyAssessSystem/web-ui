var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCPlanController = function ($scope, esRequestService, $state, ngDialog, localStorage) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCPlanController.prototype = EasyAssess.extend({
    _initialize: function ($scope, esRequestService, $state, ngDialog, localStorage) {
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
                    } else if ($($event.target).attr('es-id') == 'input') {
                        $scope.inputRecord(model);
                    } else if ($($event.target).attr('es-id') == 'view') {
                        $scope.viewRecords(model);
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

        $scope.viewRecords = function (model) {
            esRequestService.esGet(EasyAssess.activeEnv.iqc() + "plan/" + model.id + "/records")
              .then((function(response){
                  ngDialog.open({
                      template: '<div class="es-dialog-content">'
                      + '<div style="height: 800px; overflow-y: auto; overflow-x:visible;"><es-iqc-viewer es-plan="plan" es-records="records"></es-iqc-viewer></div>'
                      +'</div>',
                      plain: true,
                      className: 'ngdialog-theme-default es-large-dialog',
                      controller: ['$scope', function ($dialog) {
                          $dialog.plan = model;
                          $dialog.records = response.data;
                      }]
                  });
              }).bind(this));
        }
        
        $scope.inputRecord = function (model) {

            var todayRecord = null;
            esRequestService.esGet(EasyAssess.activeEnv.iqc() + "plan/" + model.id + "/record")
              .then((function(response){
                  todayRecord = response.data;

                  ngDialog.open({
                      template: '<div class="es-dialog-content">'
                      + '<div style="height: 500px; overflow-y: auto; overflow-x:visible;"><es-iqc-editor es-record="record"></es-iqc-editor></div>'
                      + '<div align="right"><button class="btn btn-primary" ng-click="reload()"><span class="glyphicon glyphicon-refresh"></span><span class="es-icon-button-text">重置</span></button><button class="btn btn-primary" ng-click="save()"><span class="glyphicon glyphicon-floppy-disk"></span><span class="es-icon-button-text">提交</span></button></div>'
                      +'</div>',
                      plain: true,
                      className: 'ngdialog-theme-default es-large-dialog',
                      controller: ['$scope', function ($dialog) {
                          if (!todayRecord) {
                              var preStorage = localStorage.get("IQCRecord" + model.id);
                              preStorage ? $dialog.record = JSON.parse(preStorage) : $dialog.record = createNewRecord();
                          } else {
                              todayRecord.plan = model;
                              $dialog.record = todayRecord;
                          }

                          if ($dialog.record.version != model.version) {
                              ngDialog.openConfirm({
                                  template: '<div class="ngdialog-message"><span style="color:darkred;font-weight: bold;">警告: 计划发起者已经修改了计划，您需要重载计划并重新配置你的样本，是否现在重载？</span>?</div>'
                                  + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
                                  plain: true
                              }).then(
                                  (function(){
                                      $dialog.record = createNewRecord();
                                  }).bind(this),
                                  function(reason){
                                  }
                              );
                          }

                          function createNewRecord() {
                              var additionalData = {};
                              model.additionalItems.forEach(function (item) {
                                  additionalData[item.name] = '';
                              })
                              return {
                                  name: model.name,
                                  owner: model.owner,
                                  plan: model,
                                  version: model.version,
                                  items: model.items.map(function(item) {
                                      return angular.copy(item, {});
                                  }),
                                  additionalData: additionalData
                              };
                          }

                          $dialog.save = function () {
                              esRequestService.esPost(EasyAssess.activeEnv.iqc() + "plan/" + model.id + "/record", $dialog.record)
                                .then((function(){
                                    var expires = new Date()
                                    expires.setMonth(expires.getMonth() + 1);
                                    localStorage.set("IQCRecord" + model.id, JSON.stringify($dialog.record), {expires: expires});
                                    EasyAssess.QuickMessage.message("保存成功");
                                    $dialog.closeThisDialog();
                                }).bind(this));
                          }

                          $dialog.reload = function () {
                              ngDialog.openConfirm({
                                  template: '<div class="ngdialog-message">重置操作会重新读取计划模版,是否确定?</div>'
                                  + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
                                  plain: true
                              }).then(
                                (function(value){
                                    $dialog.record = createNewRecord();
                                }).bind(this),
                                function(reason){
                                }
                              );
                          }
                      }]
                  });
              }).bind(this));
        }
        
        $scope.$on('$templateLookup_selected', (function(e, model){
            ngDialog.openConfirm({
                template:'<div class="ngdialog-message">是否加入该质控计划?</div>'
                + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
                plain: true
            }).then(
              (function(){
                  var plan = {};
                  plan.id = null;
                  plan.owner = null;
                  plan.name = model.name;
                  plan.items = model.items;
                  plan.template = model;
                  plan.records = [];
                  plan.additionalItems = model.additionalItems;

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