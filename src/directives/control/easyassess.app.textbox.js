var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppTextbox"] 
	= EasyAssess.app.directive("esAppTextbox", function() {
	return {
        restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="form-group" ng-class="error">'
		    	+ 	'<label class="control-label" for="{{esField}}">{{esLabel}}</label>'
		    	+ 	'<input type="{{esType}}" ng-model="esModel" class="form-control" id="{{esField}}" name="inputName" placeholder="{{esPlaceholder}}">'
				+   '<div ng-hide="!esReadonly">{{esModel}}</div>'
				+	'<p class="control-label" ng-hide="esValidate.validateResult" ng-class="error">{{esValidate.errorMessage}}</p>'
				+ '</div>',
		scope: {
			esLabel: "@",
			esField: "@",
			esType: "@",
			esPlaceholder: "@",
			esModel:"=",
			esReadonly: "=",
			esValidate:"=?"
		},
		link:function(scope,elem){
			if(scope.esValidate){
				elem.find('input').on('blur',function(){
					scope.esValidate.validateResult = scope.esValidate.validateMethod(scope.esModel);
					scope.error = 'none';
					if(!scope.esValidate.validateResult){
						scope.error='has-error';
					}
					scope.$apply();
                    scope.$emit('$es-validated-changed');
                });

			}

		},
		controller: ["$scope", function($scope, $element, $attrs){
			if (!$scope.esType) {
				$scope.esType = "text";
			}

		}]
	}
});
