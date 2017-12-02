var EasyAssess = require('../easyassess.application');
EasyAssess.app.HealthMinistryController = function($scope, $timeout, ngDialog, esRequestService, Upload) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.HealthMinistryController.prototype = EasyAssess.extend({
	_initialize: function($scope) {
		$scope.fields = [
			{title: EasyAssess.lang.pages.participants.orgNameText, field:"name", type:"string",searchable:true,default:true},
			{title: EasyAssess.lang.pages.participants.supervisorText, field:"supervisorName", type:"string",searchable:true, cascadeField: "supervisor.name"}
		];

		$scope.levels = [
			{text: "", value: ""},
			{text: EasyAssess.lang.pages.participants.qualification1, value: "一级"},
			{text: EasyAssess.lang.pages.participants.qualification2, value: "二级"},
			{text: EasyAssess.lang.pages.participants.qualification3, value: "三级"}
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
				errorMessage: EasyAssess.lang.pages.participants.msgOrgRequiredNameError
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
				EasyAssess.QuickMessage.message(EasyAssess.lang.pages.participants.uploadCompleteText);
				$scope.uploading = false;
				$scope.activeModel.logo = data.data;
				$scope.logoUrl = $scope.activeModel.logo;
			}).error(function (data, status, headers, config) {
				EasyAssess.QuickMessage.error(EasyAssess.lang.pages.participants.uploadFailedText);
				$scope.uploading = false;
			});
		}).bind(this));

		$scope.removeLogo = function () {
			$scope.logo = null;
			$scope.logoUrl = 'resource/add_image.png';
			$scope.activeModel.logo = null;
		};

		$scope.removeSignature = function () {
			$scope.signatureUrl = null;
			$scope.activeModel.signature = null;
		};

		$scope.$watch('signature', (function() {
			if (!$scope.signature) return;
			$scope.uploading = true;
			this.Upload.upload({
				url: EasyAssess.activeEnv['pdm']() + 'ministry/' + $scope.activeModel.id + "/signature",
				data: {
					'signature': $scope.signature
				},
				withCredentials: true
			}).success(function (data, status, headers, config) {
				EasyAssess.QuickMessage.message(EasyAssess.lang.pages.participants.uploadCompleteText);
				$scope.uploading = false;
				$scope.activeModel.signature = data.data;
				$scope.signatureUrl = $scope.activeModel.signature;
			}).error(function (data, status, headers, config) {
				EasyAssess.QuickMessage.error(EasyAssess.lang.pages.participants.uploadFailedText);
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
		if (this.$scope.activeModel) {
			if (!this.$scope.activeModel.logo) {
				this.$scope.logoUrl = 'resource/add_image.png';
			} else {
				this.$scope.logoUrl = this.$scope.activeModel.logo;
			}
			if (!this.$scope.activeModel.signature) {
				this.$scope.signatureUrl = 'resource/add_image.png';
			} else {
				this.$scope.signatureUrl = this.$scope.activeModel.signature;
			}
		}
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("health_ministryController", EasyAssess.app.HealthMinistryController);