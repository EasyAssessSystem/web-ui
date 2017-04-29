var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssessmentDetailController = function ($scope, $state, $stateParams, esRequestService, ngDialog) {
  this.initialize.apply(this, arguments);
};

EasyAssess.app.AssessmentDetailController.prototype = EasyAssess.extend({
  _initialize: function ($scope, $state, $stateParams, esRequestService, ngDialog) {
    var self = this;
    $scope.assessment = $state.current.data.detail;
    $scope.loading = true;
    self.esRequestService.esGet(EasyAssess.activeEnv.assess() + "assessment/" + $scope.assessment.id + "/forms").then(
      (function (result) {
        $scope.loading = false;
        $scope.assessment.forms = result.data.forms;
      }).bind(this)
    );
    $scope.activeModel = null;
    $scope.loading = false;
    $scope.assessname = $scope.assessment.name;
    $scope.fields = [
      {title: "机构名称", field: "name", type: "string", searchable: true, default: true},
      {title: "状态", field: "status", type: "string", searchable: false, default: false},
      {title: "分数", field: "scores", type: "string", searchable: false, default: false}
    ];

    $scope.ministriesFields = [
      {title:"名称", field:"name", type:"string",searchable:true,default:true},
      {title:"上级", field:"supervisorName", type:"string",searchable:true, cascadeField: "supervisor.name"}
    ];

    var firstback = function () {
      EasyAssess.TaskManager.start('assessment', $state);
    };

    var secondback = function () {
      $scope.activeModel = null;
    }

    $scope.isAdmin = function() {
      return EasyAssess.session.currentUser.ministries.length == 0;
    }

    $scope.$on('$ministryLookup_selected', function(e, model){
      self.esRequestService.esPut(EasyAssess.activeEnv.assess() + "assessment/" + $scope.assessment.id + "/participant", {"participant":model.id, "participantName": model.name}).then(
        (function (result) {
          $scope.assessment.participants[model.id] = model.name
          $scope.assessment.forms.push(result.data);
        }).bind(this)
      );
    });

    $scope.getStatusText = function (status) {
      switch (status) {
        case "A":
        case "S":
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

    $scope.show = function (form) {
      if (form.status != "C" && form.status != "F") return;
      $scope.loading = true;
      self.esRequestService.esGet(EasyAssess.activeEnv.assess() + "form/" + form.id).then(
        (function (result) {
          form = result.data.form;
          self.esRequestService.esGet(EasyAssess.activeEnv.assess() + "template/" + form.securedAssessment.templateGuid).then(
            (function (result) {
              $scope.loading = false;
              $scope.activeModel = {
                "template": result.data,
                "form": form
              }
            }).bind(this)
          );
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

    $scope.editAdditionalScore = function (form, $event) {
      var el = $($event.target);
      el.attr('readonly', false);
      el.removeClass('es-transparent-input');
    }

    $scope.updateAdditionalScore = function (form, $event) {
      var keycode = window.event ? $event.keyCode : $event.which;
      if(keycode==13 || !keycode) {
        var el = $($event.target);
        el.attr('readonly', true);
        el.addClass('es-transparent-input');
        form.additionalScore = Number(el.val());

        self.esRequestService.esPost(EasyAssess.activeEnv.assess() + "form/" + form.id + "/score/" + form.additionalScore).then(
            (function (result) {
              EasyAssess.QuickMessage.message("操作成功");
            }).bind(this)
        );
      }
    }

    $scope.remove = function (form, idx) {
      ngDialog.openConfirm({
        template: '<div class="ngdialog-message">是否确定删除操作?</div>'
        + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
        plain: true
      }).then(
        (function () {
          if (form.status == "F") return;
          $scope.loading = true;
          self.esRequestService.esDelete(EasyAssess.activeEnv.assess() + "assessment/" + $scope.assessment.id + "/participant/" + form.owner).then(
            (function (result) {
              for (var i=0;$scope.assessment.forms.length;i++) {
                if ($scope.assessment.forms[i].id == form.id) {
                  $scope.assessment.forms.splice(i, 1);
                  break;
                }
              }
              EasyAssess.QuickMessage.message("操作成功");
            }).bind(this)
          );
        }).bind(this)
      );
    }
  }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessment_detailController", EasyAssess.app.AssessmentDetailController);