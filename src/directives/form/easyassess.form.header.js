var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormHeader"] 
	= EasyAssess.app.directive("esFormHeader", function() {
	
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="es-form-header"><es-text-box es-content="{{esHeader.name}}" es-change-callback="nameChanged(val)" es-editable="{{esEditable}}" class="es-form-header-text" es-content-align="center" es-placeholder="' + EasyAssess.lang.forms.header.inputHeaderText + '..."></es-text-box></div>',
		scope: {
			esHeader:"=",
			esEditable:"@?"
		},
		controller: ["$scope", function($scope, $element, $attrs){
			$scope.nameChanged = function(val) {
				$scope.esHeader.name = val;
			}
		}],
		link: function(scope) {
			if (!scope.esEditable){
				scope.esEditable = true;
			}
		}
	}

});
