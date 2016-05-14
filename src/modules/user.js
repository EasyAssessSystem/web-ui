EasyAssess.app.UserController = function($scope, $http) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.UserController.prototype = angular.extend({
	_initialize: function($scope) {
		 $scope.resource = "user";
		 $scope.userType = [
     	      {text: "管理员", value: "A"},
     	      {text: "普通用户", value: "U"}
     	 ];
     	
         $scope.fields = [
              {"title":"用户名", "field":"username", "type":"string"},
              {"title":"姓名", "field":"name", "name":"string"},
              {"title":"用户类型", "field":"type", "type":"string"}
         ];
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("userController", EasyAssess.app.UserController);