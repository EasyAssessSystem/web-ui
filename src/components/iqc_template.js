var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCPlanTemplateController = function ($scope, esRequestService, $state, ngDialog) {
  this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCPlanTemplateController.prototype = EasyAssess.extend({
  _initialize: function ($scope, esRequestService) {
    $scope.fields = [
      {title:"名称", field:"name", type:"string", searchable:true, default:true}
    ];

    $scope.resource = "template";

    this._service = EasyAssess.activeEnv.iqc();

    $scope.new = function() {
      $scope.activeModel = {
        items: [],
        name: "新建计划"
      };
    }

    $scope.remove = this._delete.bind(this);
    
    $scope.back = function() {
      $scope.activeModel = null;
    }

    $scope.save = function () {
      if ($scope.activeModel.id) {
        esRequestService.esPut(EasyAssess.activeEnv.iqc() + "template" + '/' + $scope.activeModel.id, $scope.activeModel)
          .then((function(response){
            EasyAssess.QuickMessage.message("保存成功");
            $scope.activeModel = response.data;
          }));
      } else {
        esRequestService.esPost(EasyAssess.activeEnv.iqc() + "template", $scope.activeModel)
          .then((function(response){
            EasyAssess.QuickMessage.message("保存成功");
            $scope.activeModel = response.data;
          }));
      }
    }
  }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("iqc_templateController", EasyAssess.app.IQCPlanTemplateController);