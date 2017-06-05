var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcRadarChart"]
	= EasyAssess.app.directive("esIqcRadarChart", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div >'
				+ 		'<canvas id="base" class="chart-radar" chart-colors="colors"'
				+			'chart-data="data" height="120" chart-labels="labels" chart-series="series">'
				+		'</canvas>'
				+   '</div>',
		scope: {
			esBaseData: "=",
			esTargetData: "="
		},
		controller: ["$scope", function($scope){
			$scope.labels = [];
			$scope.data = [[],[]];
			$scope.colors = ['#45b7cd', '#ff6384'];
			$scope.series = ['平均数据', '你的数据'];
			for (var index in $scope.esBaseData.data) {
				var baseData = $scope.esBaseData.data[index];
				var targetData = $scope.esTargetData.data[index];
				if (baseData.averageValue) {
					$scope.labels.push("样本:" + index);
					$scope.data[0].push(baseData.averageValue.toFixed(2));
					$scope.data[1].push(targetData ? targetData.averageValue.toFixed(2) : 0);
				} else if (baseData.valueCountMap){
					var baseTotal = 0;
					var targetTotal = 0;
					for (var value in baseData.valueCountMap) {
						baseTotal += baseData.valueCountMap[value];
						if (targetData && targetData.valueCountMap[value]) {
							targetTotal += targetData.valueCountMap[value];
						}
					}

					for (var value in baseData.valueCountMap) {
						$scope.labels.push("样本:" + index + ", 选项:" + value + " (%)");
						$scope.data[0].push(((baseData.valueCountMap[value]/baseTotal) * 100).toFixed(2));
						if (targetData && targetData.valueCountMap[value]) {
							$scope.data[1].push(((targetData.valueCountMap[value]/targetTotal) * 100).toFixed(2));
						} else {
							$scope.data[1].push(0);
						}
					}
				}
			}

			if ($scope.labels.length < 3) {
				$scope.labels.push("");
				$scope.data[0].push(0);
				$scope.data[1].push(0);
			}
		}]
	}
});

EasyAssess.directives["esIqcStatisticComparisonChart"]
	= EasyAssess.app.directive("esIqcStatisticComparisonChart", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div>'
					+	'<div class="panel panel-default">'
					+		'<div class="panel-heading">{{esItemName}}</div>'
					+		'<div class="panel-body">'
					+			'<es-iqc-radar-chart es-base-data="esBaseData" es-target-data="esTargetData"></es-iqc-radar-chart>'
					+ 		'</div>'
					+	'</div>'
					+ '</div>',
		scope: {
			esBaseData: "=",
			esTargetData: "=",
			esItemName: "@"
		},
		
		controller: ["$scope", function($scope){

		}]
	}
});
