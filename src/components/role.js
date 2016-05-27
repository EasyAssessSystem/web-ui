var EasyAssess = require('../easyassess.application');


EasyAssess.app.RoleController = function($scope, $http, ngDialog) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.RoleController.prototype = angular.extend({
	_initialize: function($scope) {
		 $scope.resource = "role";
     	
         $scope.fields = [
              {"title":"姓名", "field":"name", "name":"string"},
              {"title":"状态", "field":"status", "type":"string"}
         ];

		 $scope.$on('$selected', function(e, model){
			$scope.activeModel = model;
		 });
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("roleController", EasyAssess.app.RoleController);