var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppTextbox"] 
	= EasyAssess.app.directive("esAppTextbox", function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="form-group">'
		    	+ 	'<label for="{{esField}}">{{esLabel}}</label>'
		    	+ 	'<input ng-hide="esReadonly" type="{{esType}}" ng-model="esModel" class="form-control" id="{{esField}}" placeholder="{{esPlaceholder}}">'
				+   '<div ng-hide="!esReadonly">{{esModel}}</div>'
				+ '</div>',
		scope: {
			esLabel: "@",
			esField: "@",
			esType: "@",
			esPlaceholder: "@",
			esModel:"=",
			esReadonly: "="
		},
		controller: ["$scope", function($scope, $element, $attrs){
			if (!$scope.esType) {
				$scope.esType = "text";
			}
		}]
	}
});
