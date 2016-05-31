var EasyAssess = require('../easyassess.application');


EasyAssess.app.RoleController = function($scope,ngDialog,esRequestService) {
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
		this._loadPermissions(model.id);
	},

	_loadPermissions: function(id) {
		this.$scope.permissions = [];
		this.$scope.permissionLoaded = false;
		this.esRequestService.esGet(EasyAssess.activeEnv.pdm() + "authentication/get/" + id).then(
			(function(result) {
				this.$scope.permissionLoaded = true;
				if (result.permissions.length > 0) {
					this.$scope.permissions = result.permissions;
				}
			}).bind(this)
		);
	},

	_postSave: function(model) {
		this.esRequestService.esPut(EasyAssess.activeEnv.pdm() + "authentication/update",
			{
				"role":model.id,
				"permissions": this.$scope.permissions
			}
		);
	},

	_add: function (){
		this.$scope.activeModel = EasyAssess.extend({},this.$scope.newRole);
		this._loadPermissions(0);
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("roleController", EasyAssess.app.RoleController);