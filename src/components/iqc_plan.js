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

        $scope.groupFields = [
            {title:"计划", field:"template.name", type:"string", searchable:true, default:true},
            {title:"创建人", field:"template.owner.name", type:"string", searchable:true, default:true},
            {
              title: "操作",
              template: "group_button_column.html",
              clickHandler: (function($index, model, $event) {
                if ($($event.target).attr('es-id') == 'delete') {
                  $scope.removeGroup(model);
                }
              }).bind(this)
            }
        ];

        $scope.removeGroup = function(model) {
          ngDialog.openConfirm({
            template: '<div class="ngdialog-message">删除操作无法恢复,是否确定要删除?</div>'
            + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
            plain: true
          }).then(
            (function(value){
              esRequestService.esDelete(EasyAssess.activeEnv.iqc() + "group/" + model.id)
                .then((function(){
                  $scope.$broadcast('$groupLookup_refresh');
                }).bind(this));
            }).bind(this),
            function(reason){
            }
          );
        };

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

        $scope.$on('$groupLookupselected', (function (e, model) {
            $scope.selectedGroup = model;
        }).bind(this));

        $scope.createPlan = function () {
            ngDialog.open({
                template: '<div class="es-dialog-content">'
                +       '<div style="height: 150px; overflow-y: auto; overflow-x:visible;">'
                +           '<label>记录集名称:</label><input ng-model="name" class="form-control"/>'
                +           '<div class="es-dialog-form-line" align="right"><button ng-click="submit()" class="btn btn-primary">确定</button></div>'
                +       '</div>'
                +'</div>',
                plain: true,
                className: 'ngdialog-theme-default es-large-dialog',
                controller: ['$scope', function ($dialog) {
                    $dialog.submit = function () {
                        if ($dialog.name) {
                            esRequestService.esPost(EasyAssess.activeEnv.iqc() + "group/" + $scope.selectedGroup.id + "/plan?name=" + $dialog.name, {})
                              .then(function(){
                                  EasyAssess.QuickMessage.message("保存成功");
                                  $scope.$broadcast('$refresh');
                                  $dialog.closeThisDialog();
                              });
                        } else {
                            EasyAssess.QuickMessage.error("请输入记录集名称");
                        }
                    }
                }]
            });
        };
        
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
            if ($scope.planModel) {
                $scope.planModel = null;
            } else if ($scope.selectedGroup) {
                $scope.selectedGroup = null;
            }
        };

        $scope.viewRecords = function (model) {
            //esRequestService.esGet(EasyAssess.activeEnv.iqc() + "plan/" + model.id + "/records")
              //.then((function(response){
                  ngDialog.open({
                      template: '<div class="es-dialog-content">'
                      + '<div style="height: 800px; overflow-y: auto; overflow-x:visible;"><es-iqc-viewer es-plan="plan" es-records="records"></es-iqc-viewer></div>'
                      +'</div>',
                      plain: true,
                      className: 'ngdialog-theme-default es-large-dialog',
                      controller: ['$scope', function ($dialog) {
                          $dialog.plan = model;
                          $dialog.$on('$targetDateChanged', (function(e, date){
                            if (date) {
                              esRequestService.esGet(EasyAssess.activeEnv.iqc() + "plan/" + model.id + "/records?targetDate=" + date)
                                .then(function(response){
                                  $dialog.records = response.data;
                                });
                            }
                          }).bind(this));
                      }]
                  });
              //}).bind(this));
        }

        $scope.inputRecord = function (model) {

            ngDialog.open({
                template: '<div class="es-dialog-content">'
                + '<div style="height: 530px; overflow-y: auto; overflow-x:visible;">'
                +     '<div>检测时间: <es-date-picker es-model="targetDate"/></div>'
                +     '<div style="margin-top: 20px;" ng-if="record">记录标签: <div><input ng-model="record.tags"class="es-form-signature-line"/></div></div>'
                +     '<es-iqc-editor ng-if="record" es-record="record"></es-iqc-editor>'
                +     '<a style="display:block;padding: 10px;" ng-if="!record && records" ng-click="create()">创建新记录</a>'
                +     '<table ng-if="records && !record" class="table table-striped">'
                +         '<thead>'
                +           '<tr>'
                +             '<th>标签</th>'
                +           '</tr>'
                +         '</thead>'
                +         '<tbody>'
                +           '<tr ng-click="recordSelected(r)" ng-repeat="r in records"><td>{{getRecordText(r)}}</td></tr>'
                +         '</tbody>'
                +      '</table>'
                +     '<div ng-if="record" align="right"><button class="btn btn-primary" ng-click="back()"><span class="glyphicon glyphicon-cancel"></span><span class="es-icon-button-text">取消</span><button class="btn btn-primary" ng-click="reload()"><span class="glyphicon glyphicon-refresh"></span><span class="es-icon-button-text">重置</span></button><button class="btn btn-primary" ng-click="save()"><span class="glyphicon glyphicon-floppy-disk"></span><span class="es-icon-button-text">提交</span></button></div>'
                +'</div>',
                plain: true,
                className: 'ngdialog-theme-default es-large-dialog',
                controller: ['$scope', function ($dialog) {
                    $dialog.getRecordText = function (r) {
                      return r.name + (r.tags ? " - " + r.tags:"");
                    }
                    $dialog.back = function () {
                      $dialog.record = null;
                    };
                    $dialog.create = function () {
                      $dialog.records = [];
                      var preStorage = localStorage.get("IQCRecord" + model.id);
                      var newRecord = preStorage ? JSON.parse(preStorage) : createNewRecord();
                      newRecord.id = null;
                      newRecord.date = $dialog.targetDate;
                      newRecord.comments = null;
                      newRecord.createdAt = null;
                      newRecord.lastModified = null;
                      $dialog.records.push(newRecord);
                      $dialog.record = newRecord;
                      if (newRecord.version != model.version) {
                        ngDialog.openConfirm({
                          template: '<div class="ngdialog-message"><span style="color:darkred;font-weight: bold;">警告: 计划已经更行，您需要重载计划并重新配置你的样本，否则可能会导致不正确的统计，是否现在重载？</span>?</div>'
                          + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
                          plain: true
                        }).then(
                          (function(){
                            var targetDate = $dialog.record.date;
                            newRecord = createNewRecord();
                            newRecord.id = null;
                            newRecord.date = targetDate;
                            $dialog.records = [];
                            $dialog.records.push(newRecord);
                            $dialog.record = newRecord;
                          }).bind(this),
                          function(reason){
                          }
                        );
                      }
                    };
                    $dialog.recordSelected = function (record) {
                      record.plan = model;
                      $dialog.record = record;
                    }
                    $dialog.$watch('targetDate', function () {
                        if ($dialog.targetDate) {
                            $dialog.records = null;
                            esRequestService.esGet(EasyAssess.activeEnv.iqc() + "plan/" + model.id + "/record/" + $dialog.targetDate)
                              .then((function(response){
                                  var recordsForDate = response.data;
                                  if (recordsForDate && recordsForDate.length > 0) {
                                      // if (recordsForDate.length == 1) {
                                      //   recordsForDate[0].plan = model;
                                      //   $dialog.record = recordsForDate[0];
                                      // }
                                      $dialog.records = recordsForDate;
                                  } else {
                                      ngDialog.openConfirm({
                                          template: '<div class="ngdialog-message"><span style="color:darkred;font-weight: bold;">' + $dialog.targetDate + ' 没有录入记录</span>?</div>'
                                          + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">创建新记录</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
                                          plain: true
                                      }).then(
                                        (function(){
                                          $dialog.create();
                                        }).bind(this),
                                        function(reason){
                                        }
                                      )
                                  }
                              }).bind(this));
                        }
                    });
                    // if (!todayRecord) {
                    //     var preStorage = localStorage.get("IQCRecord" + model.id);
                    //     preStorage ? $dialog.record = JSON.parse(preStorage) : $dialog.record = createNewRecord();
                    // } else {
                    //     todayRecord.plan = model;
                    //     $dialog.record = todayRecord;
                    // }
                    //

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
                        if ($dialog.record) {
                            esRequestService.esPost(EasyAssess.activeEnv.iqc() + "plan/" + model.id + "/record", $dialog.record)
                              .then((function(){
                                  var expires = new Date()
                                  expires.setMonth(expires.getMonth() + 1);
                                  localStorage.set("IQCRecord" + model.id, JSON.stringify($dialog.record), {expires: expires});
                                  EasyAssess.QuickMessage.message("保存成功");
                                  //$dialog.closeThisDialog();
                                  $dialog.back();
                              }).bind(this));
                        }
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

            /*
            var todayRecord = null;
            esRequestService.esGet(EasyAssess.activeEnv.iqc() + "plan/" + model.id + "/record")
              .then((function(response){
                  todayRecord = response.data;


              }).bind(this));
            */
        }
        
        $scope.$on('$templateLookup_selected', (function(e, model){
            ngDialog.openConfirm({
                template:'<div class="ngdialog-message">是否加入该质控计划?</div>'
                + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
                plain: true
            }).then(
              (function(){
                  var group = {};
                  group.id = null;
                  group.owner = null;
                  group.template = model;

                  esRequestService.esPost(EasyAssess.activeEnv.iqc() + "group", group)
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