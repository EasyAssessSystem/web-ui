var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcDetails"]
	= EasyAssess.app.directive("esIqcDetails", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div>'
						+'<div class="panel panel-default">'
						+	'<div class="panel-heading">IQC 历史</div>'
						+		'<div class="panel-body">'
						+ 			'<table class="table table-striped"><tr><td ng-repeat="record in esData"><span>{{record.date}} {{record.tags}}</span></td></tr>'
						+ 				'<tr><td ng-repeat="record in esData">'
						+ 					'<table class="table table-striped">'
						+   					'<tr ng-repeat="item in record.items">'
						+       					'<td>{{item.subject}}</td>'
						+       					'<td ng-repeat="specimen in item.specimens">{{specimen.number}}: {{specimen.value}}</td>'
						+   					'</tr>'
						+ 					'</table>'
						+ 					'<table class="table table-striped">'
						+  					'<tr ng-repeat="(name, value) in record.additionalData">'
						+       					'<td>{{name}}</td>'
						+       					'<td>{{value}}</td>'
						+   					'</tr>'
						+ 					'</table>'
						+ 				'</td></tr>'
						+ 			'</table>'
						+ 	'</div>'
						+'</div>'
				+ '</div>',
		scope: {
			esData: "="
		},
		
		controller: ["$scope", function($scope){

		}]
	}
});
