var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcViewer"]
	= EasyAssess.app.directive("esIqcViewer", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: 	'<div>'
					+ '<div align="center" style="color:darkgray;font-style: italic;" ng-if="esRecords.length == 0 && !isLoading">没有录入记录</div>'
					+  '<es-app-tab-pane>'
					+		'<es-app-tab es-active="true" es-ref="detailsView" es-title="室间比对">'
					+			'<div style="padding-top: 10px;">'
					+				'<es-iqc-plan-summary es-plan="esPlan"></es-iqc-plan-summary>'
					+			'</div>'
					+		'</es-app-tab>'
					+		'<es-app-tab es-ref="chartView" es-title="室内质控">'
					+			'<div style="padding-top: 10px;">'
					+ 			'<es-iqc-chart ng-repeat="(name, data) in dataModel.items" es-data="data"></es-iqc-chart>'
					+			'</div>'
					+		'</es-app-tab>'
					+		'<es-app-tab es-ref="detailsView" es-title="详细">'
					+			'<div style="padding-top: 10px;">'
					+				'<es-iqc-details es-enable-comment="{{esEnableComment}}" es-data="esRecords"></es-iqc-details>'
					+			'</div>'
					+		'</es-app-tab>'
					+	  '</es-app-tab-pane>'
					+ '</div>',
		scope: {
			esRecords: "=",
			esPlan: "=",
			esEnableComment: "@"
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
					var idx = record.tags ? record.date + "-" + record.tags : record.date;
					$scope.dataModel.items[item.subject].history[idx] = item.specimens;
				});
			});
		}]
	}
});
