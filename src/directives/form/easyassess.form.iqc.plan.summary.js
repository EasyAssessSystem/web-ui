var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcPlanSummary"]
	= EasyAssess.app.directive("esIqcPlanSummary", function(ngDialog, esRequestService) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div>'
						+'<div class="panel panel-default">'
						+	'<div class="panel-heading">统计条件</div>'
						+	'<div class="panel-body">'
						+		'<table>'
						+			'<tr style="height: 30px;" ng-repeat="def in esPlan.additionalItems track by $index">'
						+				'<td><div ng-bind="esPlan.additionalItems[$index].name"></div></td>'
						+				'<td>:</td>'
						+				'<td style="padding:0px 10px 0px 10px;">'
						+					'<input ng-if="esPlan.additionalItems[$index].type==\'STRING\'" class="es-form-signature-line" ng-blur="filterChanged(esPlan.additionalItems[$index].name, $event)"/>'
						+					'<div ng-if="esPlan.additionalItems[$index].type==\'DATE\'">'
						+						'<div class="input-group" style="width: 200px;">'
						+							'<span ng-click="openDatePicker()" style="width: 200px; height: 20px; display: block; cursor: pointer;" class="es-form-signature-line"></span>'
						+							'<span class="input-group-addon" ng-click="openDatePicker()" style="padding: 0px 0px 0px 0px;cursor: pointer;"><span class="glyphicon glyphicon-calendar"></span></span>'
						+							'<date-picker ng-model="filters[esPlan.additionalItems[$index].name]" ng-hide="hideDatePicker" ng-model="filters[esPlan.additionalItems[$index].name]" style="position: absolute;top:45px;z-index: 999" on-date-selected="dateSelected()" format-date="formatDate"></date-picker>'
						+						'</div>'
						+					'</div>'
						+					'<div ng-if="esPlan.additionalItems[$index].type==\'LISTING\'">'
						+						'<select class="form-control es-form-group-contorl" ng-blur="filterChanged(esPlan.additionalItems[$index].name, $event)"><option value=""></option><option ng-repeat="val in esPlan.additionalItems[$index].values" value="{{val}}">{{val}}</option></select>'
						+					'</div>'
						+				'</td>'
						+			'</tr>'
						+		'</table>'
						+		'<button ng-click="doStatistic()" type="button" class="btn btn-primary">'
						+			'<span class="glyphicon glyphicon-search"></span>'
						+			'<span class="es-icon-button-text">统计</span>'
						+		'</button>'
						+	'</div>'
						+'</div>'
						+'<div ng-if="model" ng-repeat="(itemName, itemDataSet) in model.base.items">'
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
			$scope.filters = {

			};

			$scope.hideDatePicker = true;

			$scope.formatDate = function (date) {
				function pad(n) {
					return n < 10 ? '0' + n : n;
				}
				return date && date.getFullYear()
					+ '-' + pad(date.getMonth() + 1)
					+ '-' + pad(date.getDate());
			};

			$scope.dateSelected = function () {
				$scope.hideDatePicker = true;
			};

			$scope.openDatePicker = function () {
				$scope.hideDatePicker = false;
			};

			$scope.filterChanged = function (name, event) {
				$scope.filters[name] = $(event.target).val();
			};

			$scope.doStatistic = function () {
				$scope.model = null;
				esRequestService.esPost(EasyAssess.activeEnv.iqc() + "plan/" + $scope.esPlan.id + "/statistic", $scope.filters)
					.then((function(response){
						if (response.data) {
							$scope.model = response.data;
						}
					}).bind(this));
			}
		}]
	}
});
