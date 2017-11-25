var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppCheckbox"]
	= EasyAssess.app.directive("esAppCheckbox", function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="form-group">'
		    	+ 	'<label ng-show="esLabel" style="padding-right: 5px;">{{esLabel}}</label>'
		    	+ 	'<input ng-hide="esReadonly" type="checkbox" ng-model="esModel" ng-checked="esModel">'
				+   '<div ng-hide="!esReadonly" ng-bind="readonlyText()"></div>'
				+ '</div>',
		scope: {
			esLabel: "@",
			esModel:"=",
			esReadonly: "="
		},
		controller: ["$scope", function($scope, $element, $attrs){
			$scope.readonlyText = function() {
				if ($scope.esModel) {
					return EasyAssess.lang.controls.checkbox.valueY;
				} else {
					return EasyAssess.lang.controls.checkbox.valueN;
				}
			}
		}]
	}
});
