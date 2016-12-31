var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcEditor"]
	= EasyAssess.app.directive("esIqcEditor", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div class="es-form-group">'
							+	 '<div class="es-form-header">{{esRecord.name}}</div>'
				  	  +	 '<table class="table table-striped">'
		          + 	'<thead><tr><th style="width:15%;">检测项目</th><th style="width:45%;">样本</th></tr></thead>'
		          +   '<tbody>'
		          +			'<tr ng-repeat="item in esRecord.items">'
							+				'<td class="es-form-group-cell" style="vertical-align: middle;"><div>{{item.subject}} - {{item.unit}}</div></td>'
							+				'<td>'
							+					'<table>'
							+						'<tr>'
							+							'<td class="es-form-group-cell" ng-repeat="specimen in item.specimens">{{specimen.number}}</td>'
							+						'</tr>'
							+						'<tr>'
							+							'<td class="es-form-group-cell" ng-repeat="specimen in item.specimens">'
							+								'<div ng-if="specimen.type == \'P\' || specimen.type == \'T\'"><input ng-model="specimen.value"/></div>'
							+								'<div ng-if="specimen.type == \'S\'"><select style="min-width: 100px;" ng-model="specimen.value"><option ng-repeat="(value, weight) in specimen.enumValues" value="{{value}}">{{value}}</option></select></div>'
							+							'</td>'
							+						'</tr>'
							+					'</table>'
							+				'</td>'
		          +			'</tr>'
							+			'<tr>'
							+				'<td colspan="2">'
							+				'<table>'
							+						'<tr style="height: 30px;" ng-repeat="(name,value) in esRecord.additionalData">'
							+							'<td>{{name}}:</td>'
							+							'<td style="padding:0px 10px 0px 10px;">'
							+								'<input value="{{value}}" class="es-form-signature-line" ng-blur="additionalDataChanged(name, $event)" placeholder="请输入辅助信息"/>'
							+							'</td>'
							+						'</tr>'
							+					'</table>'
							+				'</td>'
							+			'</tr>'
		          +	 	'</tbody></table>'
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
