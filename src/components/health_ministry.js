var EasyAssess = require('../easyassess.application');
EasyAssess.app.HealthMinistryController = function($scope,ngDialog,esRequestService) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.HealthMinistryController.prototype = EasyAssess.extend({
	_initialize: function($scope) {
		$scope.fields = [
			{title:"名称", field:"name", type:"string",searchable:true,default:true},
			{title:"状态", field:"status", type:"string",searchable:false,default:false}
		];

		$scope.newMinistry = {
			"id": -1,
			"name": "",
			"status": "A"
		};

		$scope.resource = "ministry";

		$scope.$on('$ministryLookup_selected', function(e, model){
			$scope.activeModel.ministries.push(model);
		});
	},

	_add: function (){
		this.$scope.activeModel = EasyAssess.extend({},this.$scope.newMinistry);
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("health_ministryController", EasyAssess.app.HealthMinistryController);