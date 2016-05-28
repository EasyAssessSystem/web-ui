var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppLookup"]
	= EasyAssess.app.directive("esAppLookup", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:'<div class="input-group" style="width:{{esWidth}}px;">'
				+ '<input ng-model="esModel" ng-readonly="esReadonly" type="text" class="form-control">'
				+ '<span ng-click="lookup()" class="input-group-addon" style="cursor:pointer;"><span class="glyphicon glyphicon-search"></span></span>'
				+ '</div>',
		scope: {
			esReadonly: "@",
			esWidth:"@",
			esResource:"@",
			esColumns: "=",
			esOptions:"=?",
			esId:"@",
			esValueField:"@",
			esModel:"="
		},
		controller: ["$scope", function($scope, $element, $attrs){
			if (!$scope.esWidth) {
				$scope.esWidth = 200;
			}

			if (!$scope.esReadonly) {
				$scope.esReadonly = true;
			}

			$scope.lookup = function() {
				ngDialog.open({
					template: '<div><es-app-datagrid es-resource="{{resource}}" es-options="options" es-columns="fields"></es-app-datagrid></div>',
					plain: true,
					controller: ['$scope', function($dialog) {
						$dialog.resource = $scope.esResource;
						$dialog.fields = $scope.esColumns;
						$dialog.options = $scope.esOptions;
						$dialog.$on('$selected', function(e, model){
							$scope.$emit('$' + $scope.esId + '_selected', model);
							$scope.esModel = model[$scope.esValueField];
							$dialog.closeThisDialog();
						});
					}]
				});
			}

		}]
	}
});
