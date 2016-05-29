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
              {title:"姓名", "field":"name", "name":"string",searchable:true,default:true},
              {title:"状态", "field":"status", "type":"string",searchable:true,default:true}
         ];

		 $scope.options = $scope.fields.filter(function(eachfield){
			return eachfield.searchable;
		 }).map(function(item){
			var option = {text:"",value:"",default:false};
			option.text = item.title;
			option.value = item.field;
			option.default = item.default;
			return option;
		 });
	},

	_select: function(model){
		this.$scope.activeModel = model
		this._loadPermissions(model);
	},

	_loadPermissions: function(model) {
		this.$scope.permissionLoaded = false;
		this.$http.get(EasyAssess.activeEnv + "authentication/get/" + model.id).success(
			(function(response) {
				this.$scope.permissionLoaded = true;
				if (response.permissions.length > 0) {
					this.$scope.permissions = response.permissions;
				}
			}).bind(this)
		);
	},

	_save: function() {
		this.$http.put(EasyAssess.activeEnv + "authentication/update",
			{
				"role":this.$scope.activeModel.id,
				"permissions": this.$scope.permissions
			}
		).success(
			(function(response) {
				this.super__save();
			}).bind(this)
		);
	},

	_add: function (){
		this.$scope.activeModel = this.$scope.newRole;
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("roleController", EasyAssess.app.RoleController);