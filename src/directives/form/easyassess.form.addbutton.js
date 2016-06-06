var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAddButton"] 
	= EasyAssess.app.directive("esAddButton", function() {
	
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="es-add-button" align="center"><span class="glyphicon glyphicon-plus"></span><span ng-bind="esText"></span></div>',
		scope: {
			esText:"@"
		},
		controller: ["$scope", function($scope, $element, $attrs){
		
		}],
		link: function(scope, ele, attrs, ctrl) {
			
		}
	}

});
