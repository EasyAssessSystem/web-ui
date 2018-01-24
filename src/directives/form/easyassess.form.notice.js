var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormNotice"]
	= EasyAssess.app.directive("esFormNotice", function() {
	
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div>Notice</div>',
		scope: {
		},
		controller: ["$scope", function($scope, $element, $attrs){

		}]
	}
});
