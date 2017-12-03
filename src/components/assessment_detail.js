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
      {title: EasyAssess.lang.pages.assessment.participantText, field: "name", type: "string", searchable: true, default: true},
      {title: EasyAssess.lang.pages.assessment.statusText, field: "status", type: "string", searchable: false, default: false},
      {title: EasyAssess.lang.pages.assessment.assessmentScoreText, field: "scores", type: "string", searchable: false, default: false}
    ];

    $scope.ministriesFields = [
      {title: EasyAssess.lang.pages.assessment.participantText, field:"name", type:"string",searchable:true,default:true},
      {title: EasyAssess.lang.pages.assessment.supervisorText, field:"supervisorName", type:"string",searchable:true, cascadeField: "supervisor.name"}
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
          return EasyAssess.lang.pages.assessment.statusUnfilledText;
        case "C":
          return EasyAssess.lang.pages.assessment.statusFilledText;
        case "F":
          return EasyAssess.lang.pages.assessment.statusReviewedText;
      }
      return EasyAssess.lang.pages.assessment.statusUnknownText;
    }

    $scope.items = [
      {
        name: EasyAssess.lang.pages.assessment.assessmentsText,
        bindfunc: firstback
      },
      {
        name: $scope.assessname,
        bindfunc: secondback
      }
    ];

    $scope.show = function (form) {
      if (form.status != "C" && form.status != "F") return;
      $scope.lastSelected = form;
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

    $scope.getCertUrl = function (form) {
      window.open(EasyAssess.activeEnv.assess() + "form/" + form.id + "/certification");
    }

    $scope.reject = function (form) {
      ngDialog.openConfirm({
        template: '<div class="ngdialog-message">' + EasyAssess.lang.pages.assessment.msgConfirmReopen + '</div>'
        + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">' + EasyAssess.lang.pages.assessment.okButtonText + '</button><button ng-click="closeThisDialog()" class="btn btn-primary">' + EasyAssess.lang.pages.assessment.cancelButtonText + '</button></div>',
        plain: true
      }).then(
        (function () {
          if (form.status != "C") return;
          $scope.loading = true;
          self.esRequestService.esPut(EasyAssess.activeEnv.assess() + "form/reject/" + form.id).then(
            (function (result) {
              EasyAssess.QuickMessage.message(EasyAssess.lang.pages.assessment.msgOperationComplete);
              form.status = 'A';
            }).bind(this)
          );
        }).bind(this)
      );
    }

    $scope.editAdditionalScore = function (form, $event) {
      if ($scope.assessment.status == "F") return;
      // var el = $($event.target);
      // el.attr('readonly', false);
      // el.removeClass('es-transparent-input');
      ngDialog.open({
        template: '<div class="es-dialog-content">'
                 +  '<div class="es-dialog-form-line">' + EasyAssess.lang.pages.assessment.additionalScoreText + ': <input class="form-control" ng-model="score" style="width:300px;" placeholder="输入分数"/></div>'
                 +  '<div class="es-dialog-form-line">' + EasyAssess.lang.pages.assessment.additionScoreStatementText + ': <textarea class="form-control" ng-model="desc" style="width:300px;" placeholder="' + EasyAssess.lang.pages.assessment.inputAdditionScoreStatementText + '"></textarea></div>'
                 +  '<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">' + EasyAssess.lang.pages.assessment.okButtonText + '</button></div>'
                 +'</div>',
        plain: true,
        controller: ['$scope', function ($dlgScope) {
          $dlgScope.score = form.additionalScore;
          $dlgScope.desc = form.additationScoreDesc;
          $dlgScope.submit = function () {
            form.additionalScore = Number($dlgScope.score);
            form.additationScoreDesc = $dlgScope.desc;
            self.esRequestService.esPost(EasyAssess.activeEnv.assess() + "form/" + form.id + "/score", {
                score: form.additionalScore,
                desc: form.additationScoreDesc
            }).then(
                (function () {
                  EasyAssess.QuickMessage.message(EasyAssess.lang.pages.assessment.msgOperationComplete);
                }).bind(this));
            $dlgScope.closeThisDialog();
          }
        }]
      });
    }

    $scope.updateAdditionalScore = function (form, $event) {
      if ($scope.assessment.status == "F") return;
      // var keycode = window.event ? $event.keyCode : $event.which;
      // if(keycode==13 || !keycode) {
      //   var el = $($event.target);
      //   el.attr('readonly', true);
      //   el.addClass('es-transparent-input');
      //   if (form.additionalScore != Number(el.val())) {
      //     form.additionalScore = Number(el.val());
      //     self.esRequestService.esPost(EasyAssess.activeEnv.assess() + "form/" + form.id + "/score/" + form.additionalScore).then(
      //         (function (result) {
      //           EasyAssess.QuickMessage.message("操作成功");
      //         }).bind(this)
      //     );
      //   }
      // }
    }

    $scope.remove = function (form, idx) {
      ngDialog.openConfirm({
        template: '<div class="ngdialog-message">' + EasyAssess.lang.pages.assessment.msgConfirmDelete + '</div>'
        + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">' + EasyAssess.lang.pages.assessment.okButtonText + '</button><button ng-click="closeThisDialog()" class="btn btn-primary">' + EasyAssess.lang.pages.assessment.cancelButtonText + '</button></div>',
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
              EasyAssess.QuickMessage.message(EasyAssess.lang.pages.assessment.msgOperationComplete);
            }).bind(this)
          );
        }).bind(this)
      );
    }
  }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessment_detailController", EasyAssess.app.AssessmentDetailController);