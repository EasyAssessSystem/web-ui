var EasyAssess = require('../easyassess.application');


EasyAssess.app.RoleController = function($scope, $http, ngDialog) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.RoleController.prototype = EasyAssess.extend({
	_initialize: function($scope) {
		 $scope.newRole = {
			 "id": -1,
			 "name": "",
			 "status": "A"
		 };

		 $scope.resource = "role";
     	
         $scope.fields = [
              {"title":"姓名", "field":"name", "name":"string"},
              {"title":"状态", "field":"status", "type":"string"}
         ];
	},

	_select: function(model){
		this.$scope.activeModel = model;
	},
	_add: function (){
		this.$scope.activeModel = this.$scope.newRole;
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("roleController", EasyAssess.app.RoleController);