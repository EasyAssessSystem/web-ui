var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcViewer"]
	= EasyAssess.app.directive("esIqcViewer", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:   '<div>'
							+ '<div align="center" style="color:darkgray;font-style: italic;" ng-if="esRecords.length == 0 && !isLoading">没有录入记录</div>'
							+ 	'<es-iqc-chart ng-repeat="(name, data) in dataModel.items" es-data="data"></es-iqc-chart>'
							+ '</div>',
		scope: {
			esRecords: "="
		},
		
		controller: ["$scope", function($scope, $element, $attrs){
			if (!$scope.esRecords) {
				$scope.esRecords = [];
			}

			$scope.dataModel = {
				items: {}
			};

			$scope.esRecords.forEach(function(record) {
				record.items.forEach(function(item) {
					if (!$scope.dataModel.items[item.subject]) {
						$scope.dataModel.items[item.subject] = {
							name: item.subject,
							history: {}
						};
					}
					$scope.dataModel.items[item.subject].history[record.date] = item.specimens;
				});
			});

			console.log($scope.dataModel);
		}]
	}
});
