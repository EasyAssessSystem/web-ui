var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppTabPane"]
	= EasyAssess.app.directive("esAppTabPane", function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		template:    '<div class="">'
								+ '<ul class="nav nav-tabs">'
								+	 '<li ng-repeat="tab in tabs" ng-click="select(tab)" ng-class="{active:tab.selected}"><a data-toggle="tab" href="#{{tab.esRef}}">{{tab.esTitle}}</a></li>'
								+ '</ul>'
			          + '<div class="tab-content" ng-transclude></div>'
								+'</div>',
		scope: {},
		controller: ["$scope", function($scope, $element, $attrs){
			$scope.tabs = [];

			this.append = function (tab) {
				$scope.tabs.push(tab);
			}

			$scope.select = function (tab) {
				angular.forEach($scope.tabs, function (tab) {
					tab.selected = false;
				});

				tab.selected = true;
				$scope.$emit('$tabSelected', tab.esRef);
			}
		}]
	}
});

EasyAssess.directives["esAppTab"]
	= EasyAssess.app.directive("esAppTab", function() {
	return {
		require: '^esAppTabPane',
		restrict: 'E',
		replace: true,
		transclude: true,
		template:  '<div id="{{esRef}}" class="tab-pane" ng-class="{active:selected}" ng-transclude></div>',
		scope: {
			'esTitle':'@',
			'esRef':'@',
			'esActive':'@'
		},
		controller: ["$scope", function($scope, $element, $attrs){
			if ($scope.esActive) {
				$scope.selected= true;
			}
		}],
		link: function($scope, $element, $attrs, $parentController) {
			$parentController.append($scope);
		}
	}
});
