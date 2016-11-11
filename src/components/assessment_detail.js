var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssessmentDetailController = function ($scope, $state, $stateParams, esRequestService, ngDialog) {
  this.initialize.apply(this, arguments);
};

EasyAssess.app.AssessmentDetailController.prototype = EasyAssess.extend({
  _initialize: function ($scope, $state, $stateParams, esRequestService, ngDialog) {
    $scope.assessment = $state.current.data.detail;
    $scope.activeModel = null;
    $scope.loading = false;
    $scope.assessname = $scope.assessment.name;
    $scope.fields = [
      {title: "机构名称", field: "name", type: "string", searchable: true, default: true},
      {title: "状态", field: "status", type: "string", searchable: false, default: false},
      {title: "分数", field: "scores", type: "string", searchable: false, default: false}
    ];

    var firstback = function () {
      EasyAssess.TaskManager.start('assessment', $state);
    };

    var secondback = function () {
      $scope.activeModel = null;
    }

    $scope.getStatusText = function (status) {
      switch (status) {
        case "A":
          return "未完成";
        case "C":
          return "已提交";
        case "F":
          return "已审核";
      }
      return "未知状态";
    }

    $scope.items = [
      {
        name: '考评记录',
        bindfunc: firstback
      },
      {
        name: $scope.assessname,
        bindfunc: secondback
      }
    ];

    var self = this;
    $scope.show = function (form) {
      if (form.status != "C" && form.status != "F") return;
      $scope.loading = true;
      self.esRequestService.esGet(EasyAssess.activeEnv.assess() + "template/" + form.securedAssessment.templateGuid).then(
        (function (result) {
          $scope.loading = false;
          $scope.activeModel = {
            "template": result.data,
            "form": form
          }
        }).bind(this)
      );
    }

    $scope.export = function (form) {
      window.open(EasyAssess.activeEnv.assess() + "form/excel/" + form.id)
    }

    $scope.reject = function (form) {
      ngDialog.openConfirm({
        template: '<div class="ngdialog-message">是否确定打回操作?</div>'
        + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
        plain: true
      }).then(
        (function () {
          if (form.status != "C") return;
          $scope.loading = true;
          self.esRequestService.esPut(EasyAssess.activeEnv.assess() + "form/reject/" + form.id).then(
            (function (result) {
              EasyAssess.QuickMessage.message("操作成功");
              form.status = 'A';
            }).bind(this)
          );
        }).bind(this)
      );

    }
  }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessment_detailController", EasyAssess.app.AssessmentDetailController);