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

    this._showSaveMessage = true;
    this._service = EasyAssess.activeEnv.iqc();

    $scope.new = function() {
      $scope.activeModel = {
        items: [],
        name: "新建计划"
      };
    }

    $scope.remove = this._delete.bind(this);

    $scope.save = this._save.bind(this);

    $scope.back = function() {
      $scope.activeModel = null;
    }
  }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("iqc_templateController", EasyAssess.app.IQCPlanTemplateController);