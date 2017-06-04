var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcStatisticComparisonGrid"]
	= EasyAssess.app.directive("esIqcStatisticComparisonGrid", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div>'
					+	'<div class="panel panel-default">'
					+		'<div class="panel-heading">{{esItemName}}</div>'
					+		'<div class="panel-body">'
					+			'<table class="table table-striped">'
					+				'<thead>'
					+					'<tr>'
					+						'<th>样本</th>'
					+						'<th>平均数据</th>'
					+						'<th>你的数据</th>'
					+					'</tr>'
					+				'</thead>'
					+				'<tbody>'
					+					'<tr ng-repeat="(specimen, data) in esBaseData.data">'
					+						'<td>'
					+							'{{specimen}}'
					+						'</td>'
					+						'<td ng-bind="getStatisticPlainText(data)"></td>'
					+						'<td ng-bind="getStatisticPlainText(esTargetData.data[specimen])"></td>'
					+					'</tr>'
					+					'</tbody>'
					+			'</table>'
					+ 		'</div>'
					+	'</div>'
					+ '</div>',
		scope: {
			esBaseData: "=",
			esTargetData: "=",
			esItemName: "@"
		},
		
		controller: ["$scope", function($scope){
			$scope.getStatisticPlainText = function (data) {
				if (!data) return "0";
				if (data.averageValue) {
					return data.averageValue;
				} else if (data.valueCountMap) {
					var total=0;
					for (var value in data.valueCountMap) {
						total += data.valueCountMap[value];
					}
					var results = "";
					for (var value in data.valueCountMap) {
						results += value + ": " + (data.valueCountMap[value]/total) * 100 + "% ";
					}
					return results;
				}
			};
		}]
	}
});
