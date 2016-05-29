var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppCheckbox"]
	= EasyAssess.app.directive("esAppCheckbox", function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="form-group">'
		    	+ 	'<label ng-show="esLabel">{{esLabel}}</label>'
		    	+ 	'<input type="checkbox" ng-model="esModel" ng-checked="esModel">'
				+ '</div>',
		scope: {
			esLabel: "@",
			esModel:"=",
			esValueField:"@"
		},
		controller: ["$scope", function($scope, $element, $attrs){
			
		}]
	}
});
