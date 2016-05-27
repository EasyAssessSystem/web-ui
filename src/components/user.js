var EasyAssess = require('../easyassess.application');


EasyAssess.app.UserController = function($scope, $http, ngDialog) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.UserController.prototype = EasyAssess.extend({
	_initialize: function($scope) {
		 $scope.resource = "user";
		 $scope.userType = [
     	      {text: "管理员", value: "A"},
     	      {text: "普通用户", value: "U"}
     	 ];
     	
         $scope.fields = [
              {"title":"用户名", "field":"username", "type":"string"},
              {"title":"姓名", "field":"name", "name":"string"},
              {"title":"状态", "field":"status", "type":"string"},
			  {"title":"角色", "field":"roles[0].name", "type":"string"}
         ];

		 $scope.transferData = function(rawData){
			 return rawData.map(function(obj){
				 if (obj['status'] === "A")
					 obj['status'] = "有效";
				 else
					 obj['status'] = "无效";
				 return obj
			 })
		 }
	},

	_transfer2RawData: function(model){
		if(model['status'] == "有效") {
			model['status'] = 'A';
		} else {
			model['status'] = 'U';
		}
		return model;
	},

	_onSelect: function (model) {
		this.$scope.activeModel = this._transfer2RawData(model);
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("userController", EasyAssess.app.UserController);