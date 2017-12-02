var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssayCodeController = function($scope, $timeout, ngDialog, esRequestService) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.AssayCodeController.prototype = EasyAssess.extend({
	_initialize: function($scope) {
		$scope.fields = [
			{title: EasyAssess.lang.pages.codes.codeText, field:"codeNumber", type:"string",searchable:true,default:true},
			{title: EasyAssess.lang.pages.codes.codeNameText, field:"name", type:"string",searchable:true,default:false},
			{title: EasyAssess.lang.pages.common.statusText, field:"status", type:"string",searchable:false},
			{title: EasyAssess.lang.pages.codes.codeGroupText, field:"groupName", type:"string",searchable:true, cascadeField:"group.name"}
		];

		$scope.groupFields = [
			{title: EasyAssess.lang.pages.codes.codeGroupText, field:"name", type:"string",searchable:true,default:true}
		];

		$scope.categoryFields = [
			{title: EasyAssess.lang.pages.codes.categoryText, field:"name", type:"string",searchable:true,default:true}
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
				errorMessage: EasyAssess.lang.pages.codes.msgRequireCodeNameError
			}
		}

		$scope.emptyModel = {
			"id": -1,
			"name": "",
			"codeNumber": "",
			"status": "A",
			"categories": []
		};

		$scope.resource = "code";

		$scope.$on('$es-validated-changed',function(){
			$scope.validateFinalResult = $scope.validations.name.validateResult;
			$scope.$$phase || $scope.$apply();
		});

		$scope.$on('$groupLookup_selected', function(e, model){
			$scope.activeModel.group = model;
		});

		$scope.$on('$categoryLookup_selected', function(e, model){
			$scope.activeModel.categories.push(model);
		});

		$scope.removeCategory = function(category) {
			for (var i=0; i < $scope.activeModel.categories.length;i++) {
				if ($scope.activeModel.categories[i].id == category.id) {
					$scope.activeModel.categories.splice(i,1);
					break;
				}
			}
		};
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assay_codeController", EasyAssess.app.AssayCodeController);