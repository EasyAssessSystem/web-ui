var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppLookup"]
	= EasyAssess.app.directive("esAppLookup", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div style="padding-bottom:10px;">'
				+ '<label ng-if="esLabel">{{esLabel}}</label>'
				+ '<div ng-hide="esReadonly" class="input-group" style="width:{{esWidth}}px;">'
				+ '<input ng-model="esModel" style="height:36px;" ng-readonly="esEditable" type="text" class="form-control">'
				+ '<span ng-click="lookup()" class="input-group-addon" style="cursor:pointer;"><span class="glyphicon glyphicon-search"></span></span>'
				+ '</div>'
				+ '<div ng-hide="!esReadonly">{{esModel}}</div>'
				+ '</div>',
		scope: {
			esLabel: "@",
			esEditable: "@",
			esWidth:"@",
			esResource:"@",
			esColumns: "=",
			esOptions:"=?",
			esId:"@",
			esValueField:"@",
			esModel:"=",
			esReadonly:"="
		},
		controller: ["$scope", function($scope, $element, $attrs){
			if (!$scope.esWidth) {
				$scope.esWidth = 200;
			}

			if (!$scope.esEditable) {
				$scope.esEditable = true;
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
