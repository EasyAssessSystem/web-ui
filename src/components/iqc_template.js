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
          } else if ($($event.target).attr('es-id') == 'view') {
            $scope.view(model);
          } else if ($($event.target).attr('es-id') == 'edit') {
            $scope.model = model;
          }
        }).bind(this)
      }
    ];

    $scope.planOptions = [];

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

    $scope.planFields = [
      {title:"单位名称", field:"owner.name", type:"string", searchable:true, default:true},
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
      esRequestService.esGet(EasyAssess.activeEnv.iqc() + "plan/" + model.id + "/records")
        .then((function(response){
          ngDialog.open({
            template: '<div class="es-dialog-content">'
            + '<div style="height: 800px; overflow-y: auto; overflow-x:visible;"><es-iqc-viewer es-records="records" es-plan="plan"></es-iqc-viewer></div>'
            +'</div>',
            plain: true,
            className: 'ngdialog-theme-default es-large-dialog',
            controller: ['$scope', function ($dialog) {
              $dialog.records = response.data;
              $dialog.plan = model;
            }]
          });
        }).bind(this));
    }

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
      $scope.model = null;
      $scope.viewModel = null;
    }

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