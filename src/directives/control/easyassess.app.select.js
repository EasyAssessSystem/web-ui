var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppSelect"] 
	= EasyAssess.app.directive("esAppSelect", function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="form-group">'
		    	+ 	'<label for="{{esField}}">{{esLabel}}</label>'
		    	+   '<select id="{{esField}}" name="{{esField}}" class="form-control">'
		    	+		'<option ng-repeat="option in esOptions" value="{{option.value}}">{{option.text}}</option>'
		    	+   '</select>'
				+ '</div>',
		scope: {
			esLabel: "@",
			esField: "@",
			esOptions: "="
		},
		controller: ["$scope", function($scope, $element, $attrs){
			if (!$scope.esType) {
				$scope.esType = "text";
			}
		}]
	}
});
