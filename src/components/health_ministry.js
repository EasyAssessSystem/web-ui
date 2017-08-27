var EasyAssess = require('../easyassess.application');
EasyAssess.app.HealthMinistryController = function($scope, $timeout, ngDialog, esRequestService, Upload) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.HealthMinistryController.prototype = EasyAssess.extend({
	_initialize: function($scope) {
		$scope.fields = [
			{title:"名称", field:"name", type:"string",searchable:true,default:true},
			{title:"上级", field:"supervisorName", type:"string",searchable:true, cascadeField: "supervisor.name"}
		];

		$scope.levels = [
			{text: "", value: ""},
			{text: "一级", value: "一级"},
			{text: "二级", value: "二级"},
			{text: "三级", value: "三级"}
		];

		$scope.validations = {
			name: {
				validateMethod: function (value) {
					var result = false;
					if (typeof value == 'string' && value != 0) {
						result = true;
					} else {
						result = false;
					}
					return result;
				},
				validateResult: true,
				errorMessage: "名称不能为空"
			}
		}

		$scope.emptyModel = {
			"id": -1,
			"name": "",
			"status": "A",
			"ministries":[],
			"type": "C",
			"address":"",
			"zipcode":"",
			"level": "",
			"category": ""
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

		$scope.$on('$es-validated-changed',function(){
			$scope.validateFinalResult = $scope.validations.name.validateResult;
			$scope.$$phase || $scope.$apply();
		});

		$scope.uploading = false;

		$scope.$watch('logo', (function() {
			if (!$scope.logo) return;
			$scope.uploading = true;
			this.Upload.upload({
				url: EasyAssess.activeEnv['pdm']() + 'ministry/' + $scope.activeModel.id + "/logo",
				data: {
					'logo': $scope.logo
				},
				withCredentials: true
			}).success(function (data, status, headers, config) {
				EasyAssess.QuickMessage.message("上传成功");
				$scope.uploading = false;
				$scope.activeModel.logo = data.data;
				$scope.logoUrl = $scope.activeModel.logo;
			}).error(function (data, status, headers, config) {
				EasyAssess.QuickMessage.error("上传失败");
				$scope.uploading = false;
			});
		}).bind(this));
	},

	_preSelect: function() {
		this.$timeout((function(){
			this.$scope.$broadcast('angular-ui-tree:collapse-all');
		}).bind(this), 100);
		return true;
	},

	_postSelect: function () {
		if (this.$scope.activeModel && !this.$scope.activeModel.logo) {
			this.$scope.logoUrl = 'resource/add_image.png';
		} else {
			this.$scope.logoUrl = this.$scope.activeModel.logo;
		}
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("health_ministryController", EasyAssess.app.HealthMinistryController);