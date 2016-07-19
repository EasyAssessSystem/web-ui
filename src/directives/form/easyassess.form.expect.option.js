var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormSelectionSettings"]
	= EasyAssess.app.directive("esFormSelectionSettings", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: 	    '<div>'
					+ 		'<div class="es-dialog-form-line">'
					+ 			'<span>选项值</span><a href="javascript:void(0)" style="padding-left:20px;" ng-click="addOptionValue()">添加</a>'
					+ 		'</div>'
					+ 		'<div class="es-dialog-form-line">'
					+ 			'<table class="table table-striped">'
					+ 				'<thead><tr><th>选项</th></tr></thead>'
					+ 				'<tbody>'
					+ 					'<tr ng-repeat="ov in esOption.optionValues"><td>{{ov.value}}</td><td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeOptionValue(ov.value)"></span></td></tr>'
					+ 				'</tbody>'
					+ 			'<table>'
					+		'</div>'
					+		'<div class="es-dialog-form-line">'
					+			'<div>正确值</div>'
					+			'<select ng-change="selectionChange(expectedValue)" ng-model="expectedValue" ng-options="ov.value as ov.value for ov in esOption.optionValues" style="width:100%;">'
					+			'</select>'
					+		'</div>'
					+	'</div>',
		scope: {
			esOption: "="
		},

		controller: ["$scope", function($scope) {
			$scope.expectedValue = ($scope.esOption.expectedValues && $scope.esOption.expectedValues.length > 0 ? $scope.esOption.expectedValues[0].value : ($scope.esOption.optionValues && $scope.esOption.optionValues.length > 0 ? $scope.esOption.optionValues[0].value : null));

			$scope.selectionChange = function (expectedValue) {
				$scope.expectedValue = expectedValue;
			}

			$scope.removeOptionValue = function (val) {
				for (var i = 0; i < $scope.esOption.optionValues.length; i++) {
					if ($scope.esOption.optionValues[i].value == val) {
						$scope.esOption.optionValues.splice(i, 1);
						break;
					}
				}
			}

			$scope.addOptionValue = function () {
				ngDialog.open({
					template: '<div class="es-dialog-content"><div class="es-dialog-form-line"><input class="form-control" style="width:300px;" placeholder="输入选项值" es-ids="txtValue"/></div>'
					+ '<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
					plain: true,
					controller: ['$scope', function ($digOptionValue) {
						$digOptionValue.submit = function () {
							if (!$scope.esOption.optionValues) {
								$scope.esOption.optionValues = [];
							}
							$scope.esOption.optionValues.push({
								"value": $('[es-ids=txtValue]').val()
							});
							$digOptionValue.closeThisDialog();
						}
					}]
				});
			};

			$scope.$on('$preSubmit', (function(){
				if ($scope.expectedValue) {
					if (!$scope.esOption.expectedValues) {
						$scope.esOption.expectedValues = [];
					}
					$scope.esOption.expectedValues[0] = {
						"value": $scope.expectedValue,
						"weight": 100
					};
				} else {
					$scope.esOption.expectedValues = [];
				}
			}).bind(this));
		}]
	}
});

EasyAssess.directives["esFormTargetValueSettings"]
	= EasyAssess.app.directive("esFormTargetValueSettings", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: 	  '<div>'
					+ 	'<div class="es-dialog-form-line">'
					+ 		'<es-app-textbox es-label="靶值" es-model="settings.targetValue"></es-app-textbox>'
					+ 		'<es-app-textbox es-label="上偏移(%)" es-model="settings.upPercentage"></es-app-textbox>'
					+ 		'<es-app-textbox es-label="下偏移(%)" es-model="settings.downPercentage"></es-app-textbox>'
					+ 	'</div>'
					+ '</div>',
		scope: {
			esOption: "="
		},

		controller: ["$scope", function($scope) {
			$scope.settings = {
				targetValue: 0,
				upPercentage: 0,
				downPercentage: 0
			};

			if ($scope.esOption.expectedValues && $scope.esOption.expectedValues.length > 0) {
				$scope.settings.targetValue = $scope.esOption.expectedValues[0].value;
			}

			if ($scope.esOption.parameters && $scope.esOption.parameters.length > 0) {
				$scope.settings.upPercentage = Number($scope.esOption.parameters[0].value);
				$scope.settings.downPercentage = Number($scope.esOption.parameters[1].value)
			}

			$scope.$on('$preSubmit', (function(){
				if ($scope.settings.targetValue) {
					if (!$scope.esOption.expectedValues) {
						$scope.esOption.expectedValues = [];
					}
					$scope.esOption.expectedValues[0] = {
						"value": $scope.settings.targetValue,
						"weight": 100
					};

					$scope.esOption.parameters = [
						{"name":"upPercentage", "value":Number($scope.settings.upPercentage)},
						{"name":"downPercentage", "value":Number($scope.settings.downPercentage)}
					];
				} else {
					$scope.esOption.expectedValues = [];
				}
			}).bind(this));
		}]
	}
});

EasyAssess.directives["esFormGaussianValueSettings"]
	= EasyAssess.app.directive("esFormGaussianValueSettings", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: 	  '<div>'
					+ 	'<div class="es-dialog-form-line">'
					+ 		'<es-app-textbox es-label="平均数μ" es-model="settings.micro"></es-app-textbox>'
					+ 		'<es-app-textbox es-label="标准差σ" es-model="settings.sigma"></es-app-textbox>'
					+ 	'</div>'
					+ '</div>',
		scope: {
			esOption: "="
		},

		controller: ["$scope", function($scope) {
			$scope.settings = {
				micro: 0,
				sigma: 0
			};

			if ($scope.esOption.parameters && $scope.esOption.parameters.length > 0) {
				$scope.settings.micro = Number($scope.esOption.parameters[0].value);
				$scope.settings.sigma = Number($scope.esOption.parameters[1].value)
			}

			$scope.$on('$preSubmit', (function(){
				if ($scope.settings.micro && $scope.settings.sigma) {
					if (!$scope.esOption.expectedValues) {
						$scope.esOption.expectedValues = [];
					}

					$scope.esOption.expectedValues[0] = {
						"value": "Gaussian_Value_PlaceHolder",
						"weight": 100
					};

					$scope.esOption.parameters = [
						{"name":"micro", "value":Number($scope.settings.micro)},
						{"name":"sigma", "value":Number($scope.settings.sigma)}
					];
				} else {
					$scope.esOption.expectedValues = [];
				}
			}).bind(this));
		}]
	}
});

EasyAssess.directives["esFormExpectOption"]
	= EasyAssess.app.directive("esFormExpectOption", function(ngDialog) {
	
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div class="es-form-option">'
				 +		'<div ng-if="!isSetted(esGroupRow,esSpecimenColumn)" ng-click="setSpecimenOptions(esGroupRow, esSpecimenColumn)" class="btn btn-danger es-expection-button">未设置</div>'
				 + 		'<div ng-if="isSetted(esGroupRow,esSpecimenColumn)" ng-click="setSpecimenOptions(esGroupRow, esSpecimenColumn)" class="btn btn-success es-expection-button">已设置</div>'
		         + '</div>',
		scope: {
			esGroupRow: "=",
			esSpecimenColumn: "="
		},
		
		controller: ["$scope", function($scope){
			$scope.isSetted = function(row, col) {
				var cell = row.optionMap[col.guid];
				if (cell) {
					if (cell.expectedValues && cell.expectedValues.length > 0) {
						return true;
					}
				}
				return false;
			}

			$scope.setSpecimenOptions = function(row, col) {
				ngDialog.open({
					template: '<div class="es-dialog-content">'
							+ 	'<div class="es-dialog-form-line">'
							+ 		'<select es-ids="drpType" ng-change="typeChanged()" style="width:100%;" ng-model="type">'
							+			'<option value="S">定性</option>'
							+			'<option value="T">定量-靶值</option>'
							+			'<option value="G">定量-正态分布</option>'
							+		'</select>'
							+ 	'</div>'
							+   '<div ng-if="type==\'S\'">'
							+		'<es-form-selection-settings es-option="option"></es-form-selection-settings>'
							+	'</div>'
							+   '<div ng-if="type==\'T\'">'
							+		'<es-form-target-value-settings es-option="option"></es-form-target-value-settings>'
							+	'</div>'
							+   '<div ng-if="type==\'G\'">'
							+		'<es-form-gaussian-value-settings es-option="option"></es-form-gaussian-value-settings>'
							+	'</div>'
					        + 	'<div class="es-dialog-form-line" align="right">'
							+		'<button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button>'
							+	'</div>'
					        +'</div>',
					plain: true,
					controller: ['$scope', function ($dialog) {
						$dialog.option = angular.copy(row.optionMap[col.guid], {});
						$dialog.type = $dialog.option.type ? $dialog.option.type : "S";
						$dialog.typeChanged = function() {
							$dialog.option.expectedValues = [];
							$dialog.option.optionValues = [];
							$dialog.option.parameters = [];
						}

						$dialog.submit = function () {
							$dialog.$broadcast('$preSubmit');
							$dialog.option.type = $dialog.type;
							row.optionMap[col.guid] = $dialog.option;
							$dialog.closeThisDialog();
						}
					}]
				});
			}
		}]
	}
});
