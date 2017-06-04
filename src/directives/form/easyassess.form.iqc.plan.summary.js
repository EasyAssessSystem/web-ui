var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcPlanSummary"]
	= EasyAssess.app.directive("esIqcPlanSummary", function(ngDialog, esRequestService) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div>'
						+'<div class="panel panel-default">'
						+	'<div class="panel-heading">IQC统计</div>'
						+		'<div class="panel-body">'
						+			'<div ng-repeat="(itemName, itemDataSet) in model.base.items">'
						+				'<es-iqc-statistic-comparison-chart es-item-name="{{itemName}}" es-base-data="itemDataSet" es-target-data="model.target.items[itemName]"></es-iqc-statistic-comparison-chart>'
						+			'</div>'
						+		'</div>'
						+ 	'</div>'
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
