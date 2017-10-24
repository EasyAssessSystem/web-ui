var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcChart"]
	= EasyAssess.app.directive("esIqcChart", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div>'
					+	'<div class="panel panel-default">'
					+		'<div class="panel-heading">{{esData.name}}</div>'
					+		'<div class="panel-body">'
					+ 		'<canvas id="base" class="chart-bar"'
					+				'chart-data="data" chart-labels="labels" chart-colors="colors"'
					+				'chart-dataset-override="datasetOverride">'
					+			'</canvas>'
					+ 	'</div>'
					+	'</div>'
					+ '</div>',
		scope: {
			esData: "="
		},
		
		controller: ["$scope", function($scope){
			$scope.colors = ['#45b7cd', '#ff6384', '#ff8e72'];

			$scope.labels = [];
			$scope.data = [];
			$scope.datasetOverride = [];
			console.log($scope.esData.history);
			for (var id in $scope.esData.history) {
				$scope.labels.push($scope.esData.history[id].label);
				if ($scope.datasetOverride.length == 0) {
					$scope.esData.history[id].forEach(function(data) {
						$scope.data.push([]);
						if (data.type == "S") {
							$scope.datasetOverride.push({
								label: "定量样本",
								borderWidth: 1,
								type: 'bar'
							});
						} else {
							$scope.datasetOverride.push({
								label: "检测值",
								radius: 10,
								hoverRadius: 12,
								borderWidth: 3,
								hoverBackgroundColor: "rgba(255,99,132,0.4)",
								hoverBorderColor: "rgba(255,99,132,1)",
								type: 'line'
							});
						}
					});
				}

				$scope.esData.history[id].forEach(function(data, index) {
					if (!$scope.data[index]) $scope.data[index]=[];
					if (data.type == "S") {
						$scope.data[index].push(data.enumValues[data.value]);
					} else {
						$scope.data[index].push(Number(data.value));
					}
				});
			}
		}]
	}
});
