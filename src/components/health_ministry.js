var EasyAssess = require('../easyassess.application');
EasyAssess.app.HealthMinistryController = function($scope, $timeout, ngDialog,esRequestService) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.HealthMinistryController.prototype = EasyAssess.extend({
	_initialize: function($scope) {
		$scope.fields = [
			{title:"名称", field:"name", type:"string",searchable:true,default:true},
			{title:"状态", field:"status", type:"string",searchable:false},
			{title:"上级", field:"supervisorName", type:"string",searchable:true, cascadeField: "supervisor.name"}
		];

		$scope.newMinistry = {
			"id": -1,
			"name": "",
			"status": "A",
			"ministries":[],
			"type": "C"
		};

		$scope.resource = "ministry";

		$scope.$on('$ministryLookup_selected', function(e, model){
			$scope.activeModel.ministries.push(model);
			model.supervisorId = $scope.activeModel.id;
		});

		$scope.removeMinistry = function(ministry) {
			for (var i=0; i < $scope.activeModel.ministries.length;i++) {
				if ($scope.activeModel.ministries[i].id == ministry.id) {
					$scope.activeModel.ministries.splice(i,1);
					break;
				}
			}
			ministry.supervisorId = -1;
		};
	},

	_add: function (){
		this.$scope.activeModel = EasyAssess.extend({},this.$scope.newMinistry);
	},

	_preSelect: function() {
		this.$timeout((function(){
			this.$scope.$broadcast('angular-ui-tree:collapse-all');
		}).bind(this), 100);
		return true;
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("health_ministryController", EasyAssess.app.HealthMinistryController);