var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcPlanSummary"]
	= EasyAssess.app.directive("esIqcPlanSummary", function(ngDialog, esRequestService) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div>'
						+	'<div class="panel panel-default">'
						+		'<div class="panel-heading">报表参数</div>'
						+		'<div class="panel-body ">'
						+	      '<div class="es-dialog-form-line" style="height: 30px;">'
						+	      		'<div style="float: left;width:150px;">截止日期: </div>'
						+               '<div style="float: left"><es-date-picker es-model="targetDates.endDate"></es-date-picker></div>'
						+         '</div>'
						+	      '<div class="es-dialog-form-line" style="height: 30px;">'
						+	      		'<div style="float: left;width:150px;">追溯天数: </div>'
						+               '<div style="float: left"><input type="number" ng-model="targetDates.count"/></div>'
						+         '</div>'
						+       '</div>'
						+   '</div>'
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
						// +						'<div class="input-group" style="width: 200px;">'
						// +							'<span ng-click="openDatePicker()" style="width: 200px; height: 20px; display: block; cursor: pointer;" class="es-form-signature-line"></span>'
						// +							'<span class="input-group-addon" ng-click="openDatePicker()" style="padding: 0px 0px 0px 0px;cursor: pointer;"><span class="glyphicon glyphicon-calendar"></span></span>'
						// +							'<date-picker ng-model="filters[esPlan.additionalItems[$index].name]" ng-hide="hideDatePicker" ng-model="filters[esPlan.additionalItems[$index].name]" style="position: absolute;top:45px;z-index: 999" on-date-selected="dateSelected()" format-date="formatDate"></date-picker>'
						// +						'</div>'
						+						'<es-date-picker es-model="filters[esPlan.additionalItems[$index].name]"></es-date-picker>'
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
						+		'<div style="float: left;"><es-app-ajax-downloader es-button-text="导出" es-filename="统计报表.xls" es-file-type="xls" es-url="{{exportUrl}}" es-data="filters" es-method="post"></es-app-ajax-downloader></div>'
						+	'</div>'
						+'</div>'
						+'<es-spinner ng-if="isLoading"></es-spinner>'
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

			$scope.exportUrl = EasyAssess.activeEnv.iqc() + "plan/" + $scope.esPlan.id + "/statistic/excel";

			$scope.$watch('targetDates.endDate+targetDates.count',function(){
				if ($scope.targetDates.endDate && $scope.targetDates.count) {
					$scope.exportUrl = $scope.exportUrl + "?targetDate=" + $scope.targetDates.endDate + '&count=' + $scope.targetDates.count;
				}
			});

			$scope.targetDates = {
				count: 30
			};

			$scope.isLoading = false;

			$scope.filterChanged = function (name, event) {
				$scope.filters[name] = $(event.target).val();
			};

			$scope.doStatistic = function () {
				$scope.isLoading = true;
				$scope.model = null;
				var url = EasyAssess.activeEnv.iqc() + "plan/" + $scope.esPlan.id + "/statistic";
				if ($scope.targetDates.endDate && $scope.targetDates.count) {
					url = url + "?targetDate=" + $scope.targetDates.endDate + '&count=' + $scope.targetDates.count;
				}
				esRequestService.esPost(url, $scope.filters)
					.then((function(response){
						$scope.isLoading = false;
						if (response.data) {
							$scope.model = response.data;
						}
					}).bind(this));
			}
		}]
	}
});
