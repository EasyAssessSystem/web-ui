var EasyAssess = require('../easyassess.application');
EasyAssess.app.UserController = function($scope,ngDialog,esRequestService) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.UserController.prototype = EasyAssess.extend({
	_initialize: function($scope) {
		 $scope.emptyModel = {"id":-1,"name":"","phone":"","status":"A","username":"","password":"",confirmedPassword:"","canLaunchAssessment":true,"ministries":[],"roles":[{"id":1,"name":"系统用户","status":"A"}]},
		 $scope.resource = "user";
		 $scope.newItem = EasyAssess.lang.pages.users.createUserText;
		 $scope.validations = {
			 username:{
				 validateMethod: function(value){
					 var result = false;
					 if(typeof value=='string' && value.length >=3 && value.length <=8){
						 result =  true;
					 }else {
						 result =  false;
					 }
					 return result;
				 },

				 validateResult:true,
				 errorMessage: EasyAssess.lang.pages.users.msgInvalidUsernameError
			 },
			 name:{
				 validateMethod: function(value){
					 var result = false;
					 if(typeof value=='string'&& value != 0){
						 result =  true;
					 }else {
						 result =  false;
					 }
					 return result;
				 },
				 validateResult:true,
				 errorMessage: EasyAssess.lang.pages.users.msgInvalidNameError
			 },
			 password:{
				 validateMethod: function(value){
					 var result = false;
					 if(typeof value=='string'  && value.length >=6){
						 result =  true;
					 }else {
						 result =  false;
					 }
					 return result;
				 },
				 validateResult:true,
				 errorMessage: EasyAssess.lang.pages.users.msgInvalidPasswordError
			 },
			 comfirmPassword:{
				 validateMethod: function(value){
					 var result = false;
					 if(value === $scope.activeModel.password){
						 result =  true;
					 }else {
						 result =  false;
					 }
					 return result;
				 },

				 validateResult:true,
				 errorMessage: EasyAssess.lang.pages.users.msgInvalidPasswordNotMatchError
			 }
		 };

		$scope.fields = [
			{title: EasyAssess.lang.pages.users.usernameText, field: "username", type: "string", searchable: true, default: true},
			{title: EasyAssess.lang.pages.users.nameText, field: "name", type: "string", searchable: true, default: false},
			{title: EasyAssess.lang.pages.common.statusText, field: "status", type: "string", searchable: false, default: false},
			{title: EasyAssess.lang.pages.users.roleText, field: "roles[0].name", type: "string", searchable: false, default: false},
			{title: EasyAssess.lang.pages.users.orgText, field: "ministries[0].name", type: "string", searchable: false, default: false}
		];

		 $scope.roleFields = [
			{title: EasyAssess.lang.pages.users.nameText, field:"name", type:"string", searchable:true, default:true}
		 ];

		 $scope.ministriesFields = [
			{title: EasyAssess.lang.pages.users.orgNameText, field:"name", type:"string",searchable:true,default:true},
			{title: EasyAssess.lang.pages.users.supervisorText, field:"supervisorName", type:"string",searchable:true, cascadeField: "supervisor.name"}
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

		 $scope.$on('$es-validated-changed',function(){
			$scope.validateFinalResult = $scope.validations.name.validateResult
				&& $scope.validations.username.validateResult
				&& $scope.validations.password.validateResult
				&& $scope.validations.comfirmPassword.validateResult;
			 $scope.$$phase || $scope.$apply();
		 });

		 $scope.$on('$ministryLookup_selected', function(e, model){
			$scope.activeModel.ministries[0] = model;
		 });

		 $scope.$watch('bindWithMinistry',function(newValue,oldValue, scope){
			if (!newValue && $scope.activeModel) {
				$scope.activeModel.ministries = [];
			} 
		 });

		 $scope.transferData = function(rawData){
			 return rawData.map(function(obj){
				 if (obj['status'] === "A")
					 obj['status'] = EasyAssess.lang.pages.common.statusActiveText;
				 else
					 obj['status'] = EasyAssess.lang.pages.common.statusInactiveText;
				 return obj
			 })
		 }
	},

	_select: function (model) {
		this.$scope.validateFinalResult = true;
		this.$scope.activeModel = model;
		this.$scope.confirmedPassword = this.$scope.activeModel.password;
		if (this.$scope.activeModel.ministries.length > 0) {
			this.$scope.bindWithMinistry = true;
		} else {
			this.$scope.bindWithMinistry = false;
		}
	}
}, EasyAssess.app.MaintenanceController.prototype);


EasyAssess.app.registerController("userController", EasyAssess.app.UserController);