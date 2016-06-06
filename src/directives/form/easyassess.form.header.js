var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormHeader"] 
	= EasyAssess.app.directive("esFormHeader", function() {
	
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="es-form-header"><es-text-box es-content="{{esHeader.name}}" es-change-callback="nameChanged(val)" class="es-form-header-text" es-content-align="center" es-placeholder="输入标题..."></es-text-box></div>',
		scope: {
			esHeader:"="
		},
		controller: ["$scope", function($scope, $element, $attrs){
			$scope.nameChanged = function(val) {
				$scope.esHeader.name = val;
			}
		}],
		link: function($scope) {
			
		}
	}

});
