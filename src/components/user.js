var EasyAssess = require('../easyassess.application');
EasyAssess.app.UserController = function($scope,ngDialog,esRequestService) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.UserController.prototype = EasyAssess.extend({
	_initialize: function($scope) {
		 $scope.newUser = {"id":-1,"name":"","status":"A","username":"","password":"","canLaunchAssessment":true,"roles":[{"id":1,"name":"系统用户","status":"A"}]},
		 $scope.resource = "user";
		 $scope.newItem = "创建新用户";
		 $scope.userStatus = [
     	      {text: "无效", value: "U"},
			 {text: "有效", value: "A"}
		 ];

		 $scope.userType = [
			 {text:"系统管理员",value:"系统管理员"},
			 {text:"系统用户",value:"系统用户"}
		 ];

         $scope.fields = [
              {title:"用户名", field:"username", type:"string",searchable:true,default:true},
              {title:"姓名", field:"name", type:"string",searchable:true,default:false},
              {title:"状态", field:"status", type:"string",searchable:false,default:false},
			  {title:"角色", field:"roles[0].name", type:"string",searchable:false,default:false}
         ];

		 $scope.roleFields = [
			{title:"姓名", field:"name", type:"string", searchable:true, default:true}
		 ];

		 $scope.ministriesFields = [
			{title:"名称", field:"name", type:"string",searchable:true,default:true},
			{title:"状态", field:"status", type:"string",searchable:false},
			{title:"上级", field:"supervisorName", type:"string",searchable:true, cascadeField: "supervisor.name"}
		 ];

		 $scope.roleOptions = [
			{
				text: '用户组',
				value: 'name'
			}
		 ];

		 $scope.$on('$roleLookup_selected', function(e, model){
			$scope.activeModel.roles[0] = model;
		 });

		 $scope.$on('$ministryLookup_selected', function(e, model){
			$scope.activeModel.ministries[0] = model;
		 });

		 $scope.$watch('bindWithMinistry',function(newValue,oldValue, scope){
			if (!newValue) {
				$scope.activeModel.ministries = [];
			} 
		 });

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

	_select: function (model) {
		this.$scope.activeModel = this._transfer2RawData(model);
		this.$scope.confirmedPassword = this.$scope.activeModel.password;
		if (this.$scope.activeModel.ministries.length > 0) {
			this.$scope.bindWithMinistry = true;
		} else {
			this.$scope.bindWithMinistry = false;
		}
	},

	_add:function(){
		this.$scope.activeModel = EasyAssess.extend({},this.$scope.newUser);
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("userController", EasyAssess.app.UserController);