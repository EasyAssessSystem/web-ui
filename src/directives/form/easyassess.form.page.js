/**
 * 
 */
var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormPage"] 
	= EasyAssess.app.directive("esFormPage", function() {
	
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		template: '<div class="es-form-page" ng-transclude>'
					//+ '<div><es-form-header></es-form-header></div>'
					//+ '<div><es-form-group es-columns="columns"></es-form-group></div>'
					//+ '<div><es-add-button es-text="添加新分组"></es-add-button></div>'
				  + '</div>',
		scope: {},
		controller: ["$scope", function($scope, $element, $attrs){
			
		}],
		link: function($scope) {
			
		}
	}

});
