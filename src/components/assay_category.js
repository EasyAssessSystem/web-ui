var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssayCategoryController = function($scope, $timeout, ngDialog, esRequestService) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.AssayCategoryController.prototype = EasyAssess.extend({
	_initialize: function($scope) {
		$scope.fields = [
			{title: EasyAssess.lang.pages.categories.categoryNameText, field:"name", type:"string",searchable:true,default:true},
			{title: EasyAssess.lang.pages.common.statusText, field:"status", type:"string",searchable:false}
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
				errorMessage: EasyAssess.lang.pages.categories.msgRequireCategoryNameError
			}
		}

		$scope.emptyModel = {
			"id": -1,
			"name": "",
			"status": "A"
		};

		$scope.resource = "category";

		$scope.$on('$es-validated-changed',function(){
			$scope.validateFinalResult = $scope.validations.name.validateResult;
			$scope.$$phase || $scope.$apply();
		});
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assay_categoryController", EasyAssess.app.AssayCategoryController);