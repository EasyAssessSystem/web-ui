var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcPlanSummary"]
	= EasyAssess.app.directive("esIqcPlanSummary", function(ngDialog, esRequestService) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div>'
						+'<div ng-repeat="(itemName, itemDataSet) in model.base.items">'
						+	'<es-app-tab-pane>'
						+		'<es-app-tab es-active="true" es-ref="chartView" es-title="图表">'
						+			'<div style="padding-top: 10px;">'
						+				'<es-iqc-statistic-comparison-chart es-item-name="{{itemName}}" es-base-data="itemDataSet" es-target-data="model.target.items[itemName]"></es-iqc-statistic-comparison-chart>'
						+			'</div>'
						+		'</es-app-tab>'
						+		'<es-app-tab es-ref="gridView" es-title="表格">'
						+			'<div style="padding-top: 10px;">'
						+				'<es-iqc-statistic-comparison-grid es-item-name="{{itemName}}" es-base-data="itemDataSet" es-target-data="model.target.items[itemName]"></es-iqc-statistic-comparison-grid>'
						+			'</div>'
						+		'</es-app-tab>'
						+	'</es-app-tab-pane>'
						+'</div>'
				+ '</div>',
		scope: {
			esPlan: "="
		},
		
		controller: ["$scope", function($scope){
			$scope.model = {target: {}, base: {}};
			esRequestService.esPost(EasyAssess.activeEnv.iqc() + "plan/" + $scope.esPlan.id + "/statistic", {})
				.then((function(response){
					if (response.data) {
						$scope.model = response.data;
					}
				}).bind(this));
		}]
	}
});
