var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcEditor"]
	= EasyAssess.app.directive("esIqcEditor", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div class="es-form-group">'
			 			  +  '<div>'
							+	 	'<div class="es-form-header">{{esRecord.name}}</div>'
							+	 		'<table class="table table-striped">'
		          + 		'<thead><tr><th style="width:15%;">检测项目</th><th style="width:45%;">样本</th></tr></thead>'
		          +  		'<tbody>'
		          +				'<tr ng-repeat="item in esRecord.items">'
							+					'<td class="es-form-group-cell" style="vertical-align: middle;"><div>{{item.subject}} - {{item.unit}}</div></td>'
							+					'<td>'
							+						'<table>'
							+							'<tr>'
							+								'<td class="es-form-group-cell" ng-repeat="specimen in item.specimens">{{specimen.number}}</td>'
							+							'</tr>'
							+							'<tr>'
							+								'<td class="es-form-group-cell" ng-repeat="specimen in item.specimens">'
							+									'<div ng-if="specimen.type == \'P\' || specimen.type == \'T\'"><input ng-model="specimen.value"/></div>'
							+									'<div ng-if="specimen.type == \'S\'"><select style="min-width: 100px;" ng-model="specimen.value"><option ng-repeat="(value, weight) in specimen.enumValues" value="{{value}}">{{value}}</option></select></div>'
							+								'</td>'
							+							'</tr>'
							+						'</table>'
							+					'</td>'
		          +			'</tr>'
							+				'<tr>'
							+					'<td colspan="2">'
							+					'<table>'
							+						'<tr style="height: 30px;" ng-repeat="def in esRecord.plan.additionalItems track by $index">'
							+							'<td><div ng-bind="esRecord.plan.additionalItems[$index].name"></div></td>'
							+							'<td>:</td>'
							+							'<td style="padding:0px 10px 0px 10px;">'
							+								'<input ng-if="esRecord.plan.additionalItems[$index].type==\'STRING\'" value="{{esRecord.additionalData[esRecord.plan.additionalItems[$index].name]}}" class="es-form-signature-line" ng-blur="additionalDataChanged(esRecord.plan.additionalItems[$index].name, $event)" placeholder="请输入辅助信息"/>'
							+								'<div ng-if="esRecord.plan.additionalItems[$index].type==\'DATE\'">'
							// 										'<div class="input-group" style="width: 200px;">'
							// 											'<span ng-click="openDatePicker()" style="width: 200px; height: 20px; display: block; cursor: pointer;" ng-bind="esRecord.additionalData[esRecord.plan.additionalItems[$index].name]" class="es-form-signature-line"></span>'
							// 											'<span class="input-group-addon" ng-click="openDatePicker()" style="padding: 0px 0px 0px 0px;cursor: pointer;"><span class="glyphicon glyphicon-calendar"></span></span>'
							// 											'<date-picker ng-hide="hideDatePicker" ng-model="esRecord.additionalData[esRecord.plan.additionalItems[$index].name]" style="position: absolute;top:45px;z-index: 999" on-date-selected="dateSelected()" format-date="formatDate"></date-picker>'
							// 										'</div>'
							+									'<es-date-picker es-model="esRecord.additionalData[esRecord.plan.additionalItems[$index].name]"></es-date-picker>'
							+								'</div>'
							+								'<div ng-if="esRecord.plan.additionalItems[$index].type==\'LISTING\'">'
							+									'<select ng-model="esRecord.additionalData[esRecord.plan.additionalItems[$index].name]" class="form-control es-form-group-contorl" ng-blur="additionalDataChanged(esRecord.plan.additionalItems[$index].name, $event)"><option value=""></option><option ng-repeat="val in esRecord.plan.additionalItems[$index].values" value="{{val}}">{{val}}</option></select>'
							+								'</div>'
							+							'</td>'
							+						'</tr>'
							+						'</table>'
							+					'</td>'
							+				'</tr>'
		          +	 		'</tbody></table>'
							+		'</div>'
		          + '</div>',
		scope: {
			esRecord: "="
		},
		controller: ["$scope", function($scope, $element, $attrs){
			$scope.additionalDataChanged = function (name, event) {
				$scope.esRecord.additionalData[name] = $(event.target).val();
			}
		}]
	}
});
