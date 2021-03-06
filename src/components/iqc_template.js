var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCPlanTemplateController = function ($scope, esRequestService, $state, ngDialog) {
  this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCPlanTemplateController.prototype = EasyAssess.extend({
  _initialize: function ($scope, esRequestService, $state, ngDialog) {
    $scope.fields = [
      {title:"名称", field:"name", type:"string", searchable:true, default:true},
      {title:"创建人", field:"owner.name", type:"string", searchable:true, default:false},
      {
        title: "操作",
        template: "iqc_button_column.html",
        clickHandler: (function($index, model, $event) {
          if ($($event.target).attr('es-id') == 'delete') {
            $scope.activeModel = model;
            this._delete();
          } else if ($($event.target).attr('es-id') == 'edit') {
            $scope.model = model;
          } else if ($($event.target).attr('es-id') == 'statistic') {
            $scope.generateReport(model)
          } else if ($($event.target).attr('es-id') == 'add') {
            $scope.addParticipants(model);
          }
        }).bind(this)
      }
    ];

    $scope.onOwnerSelected = function (ownerId) {
      $scope.selectedOwner = ownerId;
    };

    $scope.addParticipants = function (model) {
      ngDialog.open({
        template:
        '<div class="es-dialog-content">'
        +	'<div class="panel panel-default">'
        +		'<div class="panel-heading">选择卫生机构</div>'
        +		'<div class="panel-body ">'
        +     '<script type="text/ng-template" id="ministry_renderer_plan_creation.html">'
        +       '<div ui-tree-handle class="tree-node tree-node-content" ng-click="selectRow(item, $event)">'
        +         '<table style="width: 100%;cursor: pointer;">'
        +           '<tr>'
        +             '<td style="width: 20px;padding: 0px 5px 0px 5px;">'
        +               '<span ng-if="item.ministries && item.ministries.length > 0" ng-click="toggle(this)" class="glyphicon" ng-class="{\'glyphicon-chevron-right\': collapsed,\'glyphicon-chevron-down\': !collapsed }" style="color: #333;font-size:12px;"></span>'
        +             '</td>'
        +             '<td>'
        +               '<input ng-if="item.id != currentMinistryId && !existings[item.id]" type="checkbox" ng-change="chooseItem(item)" ng-model="item.selected"/>'
        +             '</td>'
        +             '<td style="width: 100%;">{{item.name}}<span ng-if="item.level || item.category">({{item.category}} {{item.level}})</span></td>'
        +            '</tr>'
        +         '</table>'
        +        '</div>'
        +        '<ul ui-tree-nodes ng-model="item.ministries" ng-class="{hidden: collapsed,displayed:!collapsed}">'
        +           '<li ng-repeat="item in item.ministries" ui-tree-node collapsed="true"'
        +             'ng-include="\'ministry_renderer_plan_creation.html\'">'
        +           '</li>'
        +        '</ul>'
        +      '</script>'
        +      '<div class="row">'
        +         '<div style="padding: 5px 5px 5px 5px;">'
        +           '<div ui-tree id="tree-root" data-drag-enabled="false">'
        +             '<ul ui-tree-nodes ng-model="list">'
        +               '<li ng-repeat="item in list" ui-tree-node collapsed="true"'
        +                    'ng-include="\'ministry_renderer_plan_creation.html\'"></li>'
        +             '</ul>'
        +           '</div>'
        +         '</div>'
        +     '</div>'
        +     '<div align="right"><button ng-click="submit()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>'
        +   '</div>'
        +'</div>',
        plain: true,
        controller: ['$scope', function($dialog) {
          $dialog.isLoading = true;
          $dialog.existings = model.participants;
          $dialog.submit = function () {
            var url = EasyAssess.activeEnv.iqc() + "template/" + model.id + "/participants";
            esRequestService.esPost(url, $dialog.participants).then(
              function (response) {
                EasyAssess.QuickMessage.message("添加成功");
                $dialog.closeThisDialog();
              }
            );
          }
          esRequestService.esGet(EasyAssess.activeEnv.pdm() + "ministry/list/affiliated?page=0&size=99").then(
            function (response) {
              $dialog.isLoading = false;
              $dialog.list = response.data.content;
              $dialog.currentMinistryId = EasyAssess.session.currentUser.ministries.length > 0
                ? EasyAssess.session.currentUser.ministries[0].id : -1;
              $dialog.chooseItem = function (item) {
                _updateChild(item);
                $dialog.participants = {};
                _updateEmptyModel($dialog.list);
              };

              function _updateChild(item) {
                if (item.ministries.length > 0) {
                  var newState = item.selected;
                  angular.forEach(item.ministries, function (eachMinistry) {
                    eachMinistry.selected = newState;
                    _updateChild(eachMinistry);
                  })
                }
              }

              function _updateParent(item) {
                if (item.supervisorId > 0) {
                  var parentMinistry = _searchParent(item.supervisorId, $dialog.list);
                  var parentState = false;
                  angular.forEach(parentMinistry.ministries, function (eachMinistry) {
                    parentState = eachMinistry || parentMinistry;
                  });
                  parentMinistry.selected = parentState;
                  _updateParent(parentMinistry);
                }
              }

              function _searchParent(id, nodes) {
                var parent;
                angular.forEach(nodes, function (each) {
                  if (!parent) {
                    if (each.id == id) {
                      return parent = each;
                    } else {
                      parent = _searchParent(id, each.ministries)
                    }
                  } else {
                  }
                });
                return parent;
              }

              function _updateEmptyModel(nodes) {
                angular.forEach(nodes, function (node) {
                  if (node.selected && node.id != $dialog.currentMinistryId) {
                    $dialog.participants[node.id] = node.name;
                  } else {

                  }
                  if (node.ministries.length > 0) {
                    _updateEmptyModel(node.ministries)
                  }
                })
              }
            }
          );
        }]
      });
    };

    $scope.generateReport = function (model) {
      ngDialog.open({
        template: 
            '<div class="es-dialog-content">'
            +	'<div class="panel panel-default">'
            +		'<div class="panel-heading">报表参数</div>'
            +		'<div class="panel-body ">'
            +	      '<div class="es-dialog-form-line" style="height: 30px;">'
            +	      		'<div style="float: left;width:150px;">报表类型: </div><div style="float: left"><select ng-blur="updateUrl()" ng-model="reportType" class="form-control es-form-group-contorl" style="width: 300px;"><option value="gather">汇总统计</option><option value="units">分组统计</option></select></div>'
            +         '</div>'
            +	      '<div class="es-dialog-form-line" style="height: 30px;">'
            +	      		'<div style="float: left;width:150px;">截止日期: </div>'
            +               '<div style="float: left"><es-date-picker es-model="targetDates.endDate"></es-date-picker></div>'
            +         '</div>'
            +	      '<div class="es-dialog-form-line" style="height: 30px;">'
            +	      		'<div style="float: left;width:150px;">追溯天数: </div>'
            +               '<div style="float: left"><input type="number" ng-model="targetDates.count"/></div>'
            +         '</div>'
            +       '</div>'
            +   '</div>'
            +	'<div class="panel panel-default">'
            +		'<div class="panel-heading">筛选条件</div>'
            +		'<div class="panel-body">'
            +       '<div class="es-dialog-form-line" style="height: 30px;">'
            +         '<div style="float: left;width: 150px;">记录标签</div>'
            +	        '<input class="es-form-signature-line" placeholder="请输入记录标签" ng-blur="additionalDataChanged(\'tags\', $event)"/>'
            +       '</div>'
            +	      '<div class="es-dialog-form-line" style="height: 30px;" ng-repeat="def in template.additionalItems track by $index">'
            +             '<div ng-bind="template.additionalItems[$index].name" style="float: left;width: 150px;"></div>'
            +	      	'<input ng-if="template.additionalItems[$index].type==\'STRING\'" class="es-form-signature-line" placeholder="请输入辅助信息" ng-blur="additionalDataChanged(template.additionalItems[$index].name, $event)"/>'
            +	      	'<div ng-if="template.additionalItems[$index].type==\'DATE\'" style="float: left">'
            +	      		'<es-date-picker es-model="params[template.additionalItems[$index].name]"></es-date-picker>'
            +	      	'</div>'
            +	      	'<div ng-if="template.additionalItems[$index].type==\'LISTING\'" style="float: left">'
            +	      		'<select class="form-control es-form-group-contorl" style="width: 300px;" ng-blur="additionalDataChanged(template.additionalItems[$index].name, $event)"><option value=""></option><option ng-repeat="val in template.additionalItems[$index].values" value="{{val}}">{{val}}</option></select>'
            +	      	'</div>'
            +	      '</div>'
            +         '<es-app-ajax-downloader es-button-text="生成报表" es-filename="统计报表.xls" es-file-type="xls" es-url="{{url}}" es-data="params" es-method="post"></es-app-ajax-downloader>'
            +       '</div>'
            +   '</div>'
            +'</div>',
        plain: true,
        controller: ['$scope', function($dialog) {
          $dialog.template = model;
          $dialog.reportType = "gather";
          $dialog.url = getUrl();
          $dialog.params = {};
          $dialog.targetDates = {
            count: 30
          };
          $dialog.$watch('targetDates.endDate+targetDates.count',function(){
            if ($dialog.targetDates.endDate && $dialog.targetDates.count) {
              $dialog.url = getUrl() + "?targetDate=" + $dialog.targetDates.endDate + '&count=' + $dialog.targetDates.count;
            }
          });

          function getUrl() {
            if ($dialog.reportType == "gather") {
              return EasyAssess.activeEnv.iqc() + "template/" + model.id + "/statistic";
            } else {
              return EasyAssess.activeEnv.iqc() + "template/" + model.id + "/statistic/units";
            }
          }

          $dialog.updateUrl = function () {
            $dialog.url = getUrl();
          }

          $dialog.additionalDataChanged = function (name, event) {
            $dialog.params[name] = $(event.target).val();
          }
        }]
      });
    };

    $scope.planOptions = [];

    $scope.groupOptions = [];

    $scope.$on('$templateLookup_selected', (function(e, model){
      $scope.model = {
        items: model.items,
        name: model.name,
        additionalItems: model.additionalItems
      };
    }).bind(this));

    $scope.removeGroup = function(model) {
      ngDialog.openConfirm({
        template: '<div class="ngdialog-message">删除操作无法恢复,是否确定要删除?</div>'
        + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
        plain: true
      }).then(
        (function(value){
          esRequestService.esDelete(EasyAssess.activeEnv.iqc() + "group/" + model.id)
            .then((function(){
              $scope.$broadcast('$planGroups_refresh');
            }).bind(this));
        }).bind(this),
        function(reason){
        }
      );
    }

    $scope.removePlan = function(model) {
      ngDialog.openConfirm({
        template: '<div class="ngdialog-message">删除操作无法恢复,是否确定要删除?</div>'
        + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
        plain: true
      }).then(
        (function(value){
            esRequestService.esDelete(EasyAssess.activeEnv.iqc() + "plan/" + model.id)
              .then((function(){

              }).bind(this));
        }).bind(this),
        function(reason){
        }
      );
    }

    $scope.templateFields = [
      {title:"名称", field:"name", type:"string", searchable:true, default:true},
      {title:"创建人", field:"owner.name", type:"string", searchable:true, default:false}
    ];

    $scope.planFields = [
      {title:"检测体系名称", field:"name", type:"string", searchable:true, default:true},
      {
        title: "操作",
        template: "plan_actions.html",
        clickHandler: (function($index, model, $event) {
          if ($($event.target).attr('es-id') == 'delete') {
            $scope.removePlan(model);
          } else if ($($event.target).attr('es-id') == 'view') {
            $scope.viewRecords(model);
          }
        }).bind(this)
      }
    ];

    $scope.groupFields = [
      {title:"单位名称", field:"owner.name", type:"string", searchable:true, default:true},
      {
        title: "操作",
        template: "group_actions.html",
        clickHandler: (function($index, model, $event) {
          if ($($event.target).attr('es-id') == 'delete') {
            $scope.removeGroup(model);
          }
        }).bind(this)
      }
    ];

    $scope.resource = "template";

    this._showSaveMessage = true;
    this._service = EasyAssess.activeEnv.iqc();

    $scope.new = function() {
      $scope.model = {
        items: [],
        name: "新建计划",
        additionalItems: []
      };
    }

    $scope.viewRecords = function (model) {
      //esRequestService.esGet(EasyAssess.activeEnv.iqc() + "plan/" + model.id + "/records")
        //.then((function(response){
          ngDialog.open({
            template: '<div class="es-dialog-content">'
            + '<div style="height: 800px; overflow-y: auto; overflow-x:visible;"><es-iqc-viewer es-records="records" es-enable-comment="true" es-plan="plan"></es-iqc-viewer></div>'
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

    $scope.$on('$planTemplatesselected', (function (e, model) {
      $scope.viewModel = model;
    }).bind(this));

    $scope.$on('$planGroupsselected', (function (e, model) {
      $scope.selectedGroup = model;
    }).bind(this));

    $scope.view = function(model) {
      $scope.viewModel = model;
    }

    $scope.isLoading = true;

    esRequestService.esGet(EasyAssess.activeEnv.pdm() + "ministry/list/affiliated?page=0&size=99").then(
      function (response) {
        $scope.isLoading = false;
        $scope.list = response.data.content;
      }
    );

    $scope.remove = this._delete.bind(this);

    $scope.$on('$wizard_complete', (function(e, model){
      $scope.activeModel = $scope.model;
      this._save();
      $scope.model = null;
    }).bind(this));

    $scope.back = function() {
      if ($scope.selectedGroup) {
        $scope.selectedGroup = null;
      } else {
        $scope.model = null;
        $scope.viewModel = null;
      }
    };

    $scope.chooseItem = function (item) {
      _updateChild(item);
      $scope.model.participants = {};
      _updateEmptyModel($scope.list);
    };

    function _updateEmptyModel(nodes) {
      angular.forEach(nodes, function (node) {
        if (node.selected) {
          $scope.model.participants[node.id] = node.name;
        } else {

        }
        if (node.ministries.length > 0) {
          _updateEmptyModel(node.ministries)
        }
      })
    }

    function _updateChild(item) {
      if (item.ministries.length > 0) {
        var newState = item.selected;
        angular.forEach(item.ministries, function (eachMinistry) {
          eachMinistry.selected = newState;
          _updateChild(eachMinistry);
        })
      }
    }
  },

  _preSelect: function () {
    return false;
  }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("iqc_templateController", EasyAssess.app.IQCPlanTemplateController);