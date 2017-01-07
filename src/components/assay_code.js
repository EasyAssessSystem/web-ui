var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssayCodeController = function($scope, $timeout, ngDialog, esRequestService) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.AssayCodeController.prototype = EasyAssess.extend({
	_initialize: function($scope) {
		$scope.fields = [
			{title:"代码", field:"codeNumber", type:"string",searchable:true,default:true},
			{title:"名称", field:"name", type:"string",searchable:true,default:false},
			{title:"状态", field:"status", type:"string",searchable:false},
			{title:"代码组", field:"groupName", type:"string",searchable:true, cascadeField:"group.name"}
		];

		$scope.groupFields = [
			{title:"名称", field:"name", type:"string",searchable:true,default:true}
		];

		$scope.categoryFields = [
			{title:"名称", field:"name", type:"string",searchable:true,default:true}
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
			"codeNumber": "",
			"status": "A",
			"categories": []
		};

		$scope.resource = "code";

		$scope.$on('$es-validated-changed',function(){
			$scope.validateFinalResult = $scope.validations.name.validateResult;
<<<<<<< HEAD
			//$scope.$$phase || $scope.$apply();
=======
			$scope.$apply();
>>>>>>> parent of 0259b82... Patch: safe
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