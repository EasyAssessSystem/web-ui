var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esTextBox"] 
	= EasyAssess.app.directive("esTextBox", function() {
	
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="es-editable-box" align="{{esContentAlign}}"><span ng-model="esContent" ng-blur="esChangeCallback({val:esContent})" class="es-editable-content" placeholder="{{esPlaceholder}}" contenteditable="{{esEditable}}">{{esContent}}</span></div>',
		scope: {
			"esPlaceholder":"@",
			"esContentAlign":"@",
			"esChangeCallback":"&",
			"esContent":"@",
			"esEditable":"@"
		},
		controller: ["$scope", function($scope, $element, $attrs){
			if (!$scope.esContentAlign) {
				$scope.esContentAlign = "left";
			}
		}],
		link: function(scope, ele, attrs, ctrl) {
	
		}
	}
});
