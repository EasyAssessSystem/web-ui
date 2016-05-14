var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppTextbox"] 
	= EasyAssess.app.directive("esAppTextbox", function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="form-group">'
		    	+ 	'<label for="{{esField}}">{{esLabel}}</label>'
		    	+ 	'<input type="{{esType}}" ng-model="esModel" class="form-control" id="{{esField}}" placeholder="{{esPlaceholder}}">'
				+ '</div>',
		scope: {
			esLabel: "@",
			esField: "@",
			esType: "@",
			esPlaceholder: "@",
			esModel:"="
		},
		controller: ["$scope", function($scope, $element, $attrs){
			if (!$scope.esType) {
				$scope.esType = "text";
			}
		}]
	}
});
