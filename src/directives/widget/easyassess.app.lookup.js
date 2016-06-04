var EasyAssess = require('../../easyassess.application');

EasyAssess.builders.register("esAppLookup", "textfield", function(){
	var html = '<label ng-if="esLabel">{{esLabel}}</label>'
		+ '<div ng-hide="esReadonly" class="input-group" style="width:{{esWidth}}px;">'
		+ '<input ng-model="esModel" style="height:36px;" ng-readonly="esEditable" type="text" class="form-control">'
		+ '<span ng-click="lookup()" class="input-group-addon" style="cursor:pointer;"><span class="glyphicon glyphicon-search"></span></span>'
		+ '</div>'
		+ '<div ng-hide="!esReadonly">{{esModel}}</div>';
	return html;
});

EasyAssess.builders.register("esAppLookup", "button", function(){
	var html = '<div ng-hide="esReadonly" style="width:{{esWidth}}px;">'
		+ '<button ng-click="lookup()" type="button" class="btn btn-primary">'
		+ 	'<span class="glyphicon glyphicon-plus-sign"></span>'
		+ 	'<span class="es-icon-button-text">{{esLabel}}</span>'
		+ '</button>'
		+ '</div>';
	return html;
});

EasyAssess.directives["esAppLookup"]
	= EasyAssess.app.directive("esAppLookup", function(ngDialog) {

	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: function(ele, attrs) {
			var provider = "textfield";
			if (attrs["esProvider"]) {
				provider = attrs["esProvider"];
			}
			var html = '<div style="padding-bottom:10px;">'
				+ EasyAssess.builders.get("esAppLookup", provider)()
				+ '</div>';
			return html;
		},
		scope: {
			esLabel: "@",
			esEditable: "@",
			esWidth:"@",
			esResource:"@",
			esColumns: "=",
			esId:"@",
			esValueField:"@",
			esModel:"=",
			esReadonly:"=",
			esQuery:"=?"
		},
		controller: ["$scope", function($scope, $element, $attrs){
			if (!$scope.esWidth) {
				$scope.esWidth = 200;
			}

			if (!$scope.esEditable) {
				$scope.esEditable = true;
			}

			$scope.esOptions = $scope.esColumns.filter(function(eachfield){
				return eachfield.searchable;
			}).map(function(item){
				var option = {text:"",value:"",default:false};
				option.text = item.title;
				option.value = item.field;
				option.default = item.default;
				return option;
			});

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


