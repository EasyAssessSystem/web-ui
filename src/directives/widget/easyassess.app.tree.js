var EasyAssess = require('../../easyassess.application');

require('../template/easyassess.app.tree.html');

EasyAssess.directives["esAppTree"]
	= EasyAssess.app.directive("esAppTree", function(ngDialog, $timeout) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		templateUrl:'easyassess.app.tree.html',
		scope: {

		},
		controller: ["$scope", function($scope, $element, $attrs){

			$scope.collapseAll = function () {
				$scope.$broadcast('angular-ui-tree:collapse-all');
			};

			$scope.expandAll = function () {
				$scope.$broadcast('angular-ui-tree:expand-all');
			};

			$scope.data = [{
				'id': 1,
				'title': 'node1',
				'nodes': [
					{
						'id': 11,
						'title': 'node1.1',
						'nodes': [
							{
								'id': 111,
								'title': 'node1.1.1',
								'nodes': []
							}
						]
					},
					{
						'id': 12,
						'title': 'node1.2',
						'nodes': []
					}
				]
			}, {
				'id': 2,
				'title': 'node2',
				'nodrop': true, // An arbitrary property to check in custom template for nodrop-enabled
				'nodes': [
					{
						'id': 21,
						'title': 'node2.1',
						'nodes': []
					},
					{
						'id': 22,
						'title': 'node2.2',
						'nodes': []
					}
				]
			}, {
				'id': 3,
				'title': 'node3',
				'nodes': [
					{
						'id': 31,
						'title': 'node3.1',
						'nodes': []
					}
				]
			}];
		}],

		link: function($scope) {
			$timeout(function(){
				$scope.$broadcast('angular-ui-tree:collapse-all');
			}, 1000);

		}
	}
});


