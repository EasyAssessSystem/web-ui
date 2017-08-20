var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppComponent"] 
	= EasyAssess.app.directive("esAppComponent", function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		template: '<div class="es-app-component-wrapper">'
			     + '<div class="es-app-seperator-line"><es-app-ministry-bar></es-app-ministry-bar></div>'
			     + '<div style="padding:30px 30px 30px 15px;"><div class="es-app-task-container" ng-transclude></div></div>'
			     + '</div>',
		scope: {
			
		},
		controller: ["$scope", function($scope, $element, $attrs){
			
		}],
		link: function($scope) {
			
		}
	}
});
