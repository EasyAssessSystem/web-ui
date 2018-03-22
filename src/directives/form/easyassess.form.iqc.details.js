var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcDetails"]
	= EasyAssess.app.directive("esIqcDetails", function(ngDialog, esRequestService) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div>'
						+'<div class="panel panel-default">'
						+	'<div class="panel-heading">IQC 历史</div>'
						+		'<div class="panel-body" style="max-width: 1000px;overflow: auto"">'
						+ 			'<table class="table table-striped"><tr><td ng-repeat="record in esData"><span>{{record.date}}</span><a ng-click="addComment(record)" ng-if="esEnableComment">添加批注</a></td></tr>'
						+ 				'<tr><td ng-repeat="record in esData">'
						+ 					'<table class="table table-striped">'
						+   					'<tr ng-repeat="item in record.items">'
						+       					'<td>{{item.subject}}</td>'
						+       					'<td ng-repeat="specimen in item.specimens"><a href="javascript:void(0)" title="({{specimen.targetValue}} ±{{specimen.floatValue}})">{{specimen.number}}: {{specimen.value}}</a></td>'
						+   					'</tr>'
						+ 					'</table>'
						+ 					'<table class="table table-striped">'
						+           '<tr>'
						+							'<td>记录标签:</td>'
						+							'<td>{{record.tags}}</td>'
						+						'</tr>'
						+  					'<tr ng-repeat="(name, value) in record.additionalData">'
						+       					'<td>{{name}}</td>'
						+       					'<td>{{value}}</td>'
						+   					'</tr>'
			      +           '<tr>'
		        +							'<td>记录创建时间:</td>'
			      +							'<td>{{record.createdAt}}</td>'
		        +						'</tr>'
						+           '<tr>'
						+							'<td>最后修改时间:</td>'
						+							'<td>{{record.lastModified}}</td>'
						+						'</tr>'
						+           '<tr>'
						+							'<td>批注:</td>'
						+							'<td style="color: red">{{record.comments}}</td>'
						+						'</tr>'
						+ 					'</table>'
						+ 				'</td></tr>'
						+ 			'</table>'
						+ 	'</div>'
						+'</div>'
				+ '</div>',
		scope: {
			esData: "=",
			esEnableComment: "@"
		},
		
		controller: ["$scope", function($scope){
			$scope.addComment = function (record) {
				ngDialog.open({
					template: '<div class="es-dialog-content">'
					+       '<div style="height: 150px; overflow-y: auto; overflow-x:visible;">'
					+           '<label>批注:</label><input ng-model="comment" class="form-control"/>'
					+           '<div class="es-dialog-form-line" align="right"><button ng-click="submit()" class="btn btn-primary">确定</button></div>'
					+       '</div>'
					+'</div>',
					plain: true,
					className: 'ngdialog-theme-default es-large-dialog',
					controller: ['$scope', function ($dialog) {
						$dialog.submit = function () {
							if (!$dialog.comment) {
								$dialog.comment = null;
							}
							esRequestService.esPost(EasyAssess.activeEnv.iqc() + "plan/record/" + record.id+ "/comment/" + $dialog.comment, {})
								.then(function(){
									EasyAssess.QuickMessage.message("保存成功");
									$scope.$broadcast('$refresh');
									$dialog.closeThisDialog();
									record.comment = $dialog.comment;
							});
						}
					}]
				});
			};
		}]
	}
});
