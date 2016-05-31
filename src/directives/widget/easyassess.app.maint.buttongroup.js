var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppMaintButtonGroup"] 
	= EasyAssess.app.directive("esAppMaintButtonGroup", function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="es-maint-button-group">'
					+ '<button ng-click="save()" type="button" class="btn btn-primary">'
					+ 	'<span class="glyphicon glyphicon-ok"></span>'
					+ 	'<span class="es-icon-button-text">保存</span>'
					+ '</button>'
					+ '<button ng-click="delete()" type="button" class="btn btn-primary">'
					+ 	'<span class="glyphicon glyphicon-remove"></span>'
					+ 	'<span class="es-icon-button-text">删除</span>'
					+ '</button>'
					+ '<button ng-click="cancel()" type="button" class="btn btn-primary">'
					+ 	'<span class="glyphicon glyphicon-share-alt"></span>'
					+ 	'<span class="es-icon-button-text">取消</span>'
					+ '</button>'
				+'</div>',
		scope: {
			
		},
		
		controller: ["$scope", function($scope, $element, $attrs){
			$scope.cancel = function() {
				 $scope.$emit('$cancel');
			};
			
			$scope.save = function() {
				 $scope.$emit('$save');
			};

			$scope.delete = function() {
				 $scope.$emit('$delete');
			};
		}],
		
		link: function($scope, $element, $attrs, $parentController) {
		}
	}
});
