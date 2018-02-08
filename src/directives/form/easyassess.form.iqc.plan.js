var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcSpecimenSelectionSettings"]
	= EasyAssess.app.directive("esIqcSpecimenSelectionSettings", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:
			'<div>'
		+ 		'<div class="es-dialog-form-line">'
		+ 			'<span>选项值</span><a href="javascript:void(0)" style="padding-left:20px;" ng-click="addOptionValue()">添加</a>'
		+ 		'</div>'
		+ 		'<div class="es-dialog-form-line" style="max-height:200px;overflow:auto;">'
		+ 			'<table class="table table-striped">'
		+ 				'<thead><tr><th>选项</th><th>值</th></tr></thead>'
		+ 				'<tbody>'
		+ 					'<tr ng-repeat="(value,weight) in esSpecimen.enumValues"><td>{{value}}</td><td>{{weight}}</td><td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeOptionValue(value)"></span></td></tr>'
		+ 				'</tbody>'
		+ 			'</table>'
		+		'</div>'
		+ 		'<div class="es-dialog-form-line">'
		+ 			'<span>靶值:</span>'
		+			'<select es-id="targetValue" ng-model="esSpecimen.targetValue" convert-to-number class="form-control es-form-group-contorl" style="width: 300px;"><option ng-repeat="(value,weight) in esSpecimen.enumValues" value="{{weight}}">{{value}} ({{weight}})</option></select>'
		+ 		'</div>'
		+ 		'<div class="es-dialog-form-line">'
		+ 			'<span>上下浮动范围(±)<span ng-if="esType==\'T\'">n</span>):</span><input type="number" class="form-control" style="width:300px;" ng-model="esSpecimen.floatValue" placeholder="输入上下浮动值"/></span>'
		+ 		'</div>'
		+	'</div>',
		scope: {
			esSpecimen: "="
		},

		controller: ["$scope", function($scope) {
			$scope.removeOptionValue = function (value) {
				delete $scope.esSpecimen.enumValues[value];
			}

			$scope.addOptionValue = function () {
				ngDialog.open({
					template: '<div class="es-dialog-content"><div class="es-dialog-form-line"><input class="form-control" style="width:300px;" placeholder="输入选项值" es-ids="txtValue"/></div>'
					+ '<div class="es-dialog-form-line"><select class="form-control" style="width:300px;" es-ids="txtWeight"><option ng-repeat="weight in weights" value="{{weight}}">{{weight}}</option></select></div>'
					+ '<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
					plain: true,
					controller: ['$scope', function ($digOptionValue) {
						$digOptionValue.weights = [
							-1,0,1,2,3,4,5,6,7,8,9
						];

						$digOptionValue.submit = function () {
							$scope.esSpecimen.enumValues[$('[es-ids=txtValue]').val()] = $('[es-ids=txtWeight]').val();
							$digOptionValue.closeThisDialog();
						}
					}]
				});
			}
		}]
	}
});

EasyAssess.directives["esIqcSpecimenTargetValueSettings"]
	= EasyAssess.app.directive("esIqcSpecimenTargetValueSettings", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:
		'<div>'
		+ 	'<div class="es-dialog-form-line">'
		+ 		'<span>靶值:</span><input type="number" class="form-control" style="width:300px;" ng-model="esSpecimen.targetValue" placeholder="输入靶值"/>'
		+ 	'</div>'
		+ 	'<div class="es-dialog-form-line">'
		+ 		'<span>上下浮动范围(±<span ng-if="esType==\'P\'">%</span><span ng-if="esType==\'T\'">n</span>):</span><input type="number" class="form-control" style="width:300px;" ng-model="esSpecimen.floatValue" placeholder="输入上下浮动值"/>'
		+ 	'</div>'
		+	'</div>',
		scope: {
			esSpecimen: "=",
			esType: "@"
		}
	}
});

EasyAssess.directives["esIqcPlanDesigner"]
	= EasyAssess.app.directive("esIqcPlanDesigner", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div class="es-form-group">'
		+	 '<div class="es-form-header"><es-text-box es-content="{{esTemplate.name}}" es-change-callback="nameChanged(val)" class="es-form-header-text" es-content-align="center" es-placeholder="输入标题..."></es-text-box></div>'
		+	 '<table class="table table-striped">'
		+ 	'<thead><tr><th style="width:15%;">检测项目</th><th style="width:45%;">样本</th></tr></thead>'
		+   '<tbody>'
		+			'<tr ng-repeat="item in esTemplate.items">'
		+				'<td class="es-form-group-cell" style="vertical-align: middle;"><div>{{item.subject}} - {{item.unit}} <span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeItem(item)"></span></div></td>'
		+				'<td>'
		+					'<table>'
		+						'<tr>'
		+							'<td class="es-form-group-cell" ng-repeat="specimen in item.specimens"><table><tr><td><div class="btn btn-primary" style="width: auto;" ng-click="setSpecimenOptions(specimen)">{{specimen.number}}</div></td><td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeSpecimen(item, specimen)"></span></td></tr></table></td>'
		+							'<td><es-add-button ng-click="addSpecimen(item)" style="min-width:50px;" es-text="样本" title="添加样本"></es-add-button></td>'
		+						'</tr>'
		+					'</table>'
		+				'</td>'
		+			'</tr>'
		+			'<tr>'
		+				'<td colspan="3" style="padding:5px 0px 5px 0px;">'
		+					'<es-add-button ng-click="addSubject()" es-ids="addItem" es-text="添加新项目" title="添加新项目"></es-add-button>'
		+				'</td>'
		+			'</tr>'
		+			'<tr>'
		+				'<td colspan="3">'
		+					'<table>'
		+						'<tr style="height: 30px; cursor: pointer;" ng-repeat="def in esTemplate.additionalItems track by $index">'
		+							'<td><div ng-bind="esTemplate.additionalItems[$index].name" ng-dblclick="editAdditionalItem(esTemplate.additionalItems[$index])"></div></td>'
		+							'<td>:</td>'
		+							'<td style="padding:0px 10px 0px 10px;"><span style="width: 200px; height: 20px; display: block;" class="es-form-signature-line"></span></td>'
		+							'<td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeAdditionalItem($index)"></span></td>'
		+						'</tr>'
		+					'</table>'
		+				'</td>'
		+			'</tr>'
		+			'<tr>'
		+				'<td colspan="3" style="padding:5px 0px 5px 0px;">'
		+					'<es-add-button ng-click="editAdditionalItem()" es-ids="addAdditionalItem" es-text="添加辅助信息" title="添加辅助信息"></es-add-button>'
		+				'</td>'
		+			'</tr>'
		+			'<tr>'
		+				'<td colspan="3" style="padding:5px 0px 5px 0px;">'
		+					'<span class="es-form-group-title">填报说明:</span>'
		+					'<div class="es-form-footer"><es-text-box es-content="{{esTemplate.comment}}" es-change-callback="contentChange(val)" es-editable="true" class="es-form-footer-text" es-placeholder="输入说明内容..."></es-text-box></div>'
		+				'</td>'
		+			'</tr>'
		+	 	'</tbody></table>'
		+ '</div>',
		scope: {
			esTemplate:"="
		},

		controller: ["$scope", function($scope, $element, $attrs){

			$scope.contentChange = function (val) {
				$scope.esTemplate.comment = val;
			}

			if (!$scope.esTemplate.editAdditionalItems) {
				$scope.esTemplate.editAdditionalItems = [];
			}

			$scope.nameChanged = function(val) {
				$scope.esTemplate.name = val;
			}

			$scope.addSubject = function () {
				ngDialog.open({
					template: '<div class="es-dialog-content">'
					+'<div class="es-dialog-form-line"><es-app-lookup es-value-field="name" es-label="检测项" es-columns="categoryFields" es-id="categoryLookup" es-resource="category"></es-app-lookup></div>'
					+'<div class="es-dialog-form-line"><select es-ids="drpUnits" style="width:100%;height:30px;"><option ng-repeat="unit in units" value="{{unit.value}}">{{unit.value}}</option></select></div>'
					+'<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
					plain: true,
					controller: ['$scope', function($dialog) {
						$dialog.categoryFields = [
							{title:"名称", field:"name", type:"string",searchable:true,default:true}
						];

						$dialog.$on('$categoryLookup_selected', function(e, model){
							$dialog.activeModel = model;
						});

						$dialog.submit = function(){
							var unit = $("[es-ids=drpUnits]").val();
							$scope.esTemplate.items.push({
								"subject": $dialog.activeModel.name,
								"unit": unit,
								"specimens": []
							});
							$dialog.closeThisDialog();
						};
						$dialog.units = EasyAssess.units;
					}]
				});
			}

			$scope.removeSpecimen = function(item, specimen) {
				item.specimens = item.specimens.filter(function(el) {
					return el != specimen;
				});
			}

			$scope.removeItem = function(item) {
				$scope.esTemplate.items = $scope.esTemplate.items.filter(function(el) {
					return el != item;
				});
			}

			$scope.addSpecimen = function(item) {
				ngDialog.open({
					template: '<div class="es-dialog-content">'
					+'<div ng-repeat="input in inputs" class="es-dialog-form-line">'
					+	'样本组成-{{$index+1}}:<input class="form-control es-specimen-input" placeholder="请输入样本编号"/>'
					+'</div>'
					+'<div class="es-dialog-form-line" align="right">'
					+	'<es-add-button ng-click="addSubSpecimen()" es-text="添加混合样本号"></es-add-button>'
					+'</div>'
					+'<div class="es-dialog-form-line" align="right">'
					+	'<button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button>'
					+'</div>'
					+'</div>',
					plain: true,
					scope: $scope,
					controller: ['$scope', function($dialog) {
						$dialog.inputs = [0];

						$dialog.addSubSpecimen = function() {
							$dialog.inputs.push($dialog.inputs.length);
						}

						$dialog.submit = function(){
							var inputs = $(".es-specimen-input");
							var number = '';
							inputs.each(function(){
								if (number) {
									number += "+" + $(this).val();
								} else {
									number = $(this).val();
								}
							});

							if (number) {
								item.specimens.push({
									"number": number,
									"type": "S",
									"enumValues": {},
									"targetValue": 0,
									"floatValue": 0
								});
							}
							$dialog.closeThisDialog();
						}
					}]
				});
			}

			$scope.setSpecimenOptions = function(specimen) {
				ngDialog.open({
					template: '<div class="es-dialog-content">'
					+ 	'<div class="es-dialog-form-line">'
					+ 		'<select ng-model="specimen.type" es-ids="drpType" style="width:100%;" ng-model="type">'
					+			'<option value="S">定性</option>'
					+			'<option value="T">定量-靶值(%)</option>'
					+			'<option value="P">定量-靶值(n)</option>'
					+		'</select>'
					+ 	'</div>'
					+   '<div ng-if="specimen.type==\'S\'">'
					+			'<es-iqc-specimen-selection-settings es-specimen="specimen"></es-iqc-specimen-selection-settings>'
					+		'</div>'
					+   '<div ng-if="specimen.type==\'P\'">'
					+			'<es-iqc-specimen-target-value-settings es-specimen="specimen" es-type="T"></es-iqc-specimen-target-value-settings>'
					+		'</div>'
					+   '<div ng-if="specimen.type==\'T\'">'
					+			'<es-iqc-specimen-target-value-settings es-specimen="specimen" es-type="P"></es-iqc-specimen-target-value-settings>'
					+		'</div>'
					+ 	'<div class="es-dialog-form-line" align="right">'
					+			'<button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button>'
					+		'</div>'
					+'</div>',
					plain: true,
					controller: ['$scope', function ($dialog) {
						$dialog.specimen = angular.copy(specimen, {});
						$dialog.submit = function () {
							angular.copy($dialog.specimen, specimen);
							$dialog.closeThisDialog();
						}
					}]
				});
			}

			$scope.editAdditionalItem = function (item) {
				ngDialog.open({
					template: '<div class="es-dialog-content">'
					+ 	'<div class="es-dialog-form-line" align="right">'
					+		'名称:<input ng-model="item.name" class="form-control es-specimen-input" placeholder="请输入辅助信息名称"/>'
					+	'</div>'
					+ 	'<div class="es-dialog-form-line">'
					+ 		'<select ng-model="item.type" es-ids="drpType" style="width:100%;height: 30px;" ng-model="type">'
					+			'<option value="STRING">文本</option>'
					+			'<option value="DATE">日期</option>'
					+			'<option value="LISTING">列表</option>'
					+		'</select>'
					+ 	'</div>'
					+   '<div ng-if="item.type==\'LISTING\'">'
					+ 		'<div class="es-dialog-form-line">'
					+ 			'<a href="javascript:void(0)" style="padding-left:20px;" ng-click="addListingValue()">添加</a>'
					+ 		'</div>'
					+ 		'<div class="es-dialog-form-line" style="max-height:200px;overflow:auto;">'
					+ 			'<table class="table table-striped">'
					+ 				'<thead><tr><th>选项值</th></tr></thead>'
					+ 				'<tbody>'
					+ 					'<tr ng-repeat="def in item.values track by $index"><td>{{item.values[$index]}}</td><td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeListingValue($index)"></span></td></tr>'
					+ 				'</tbody>'
					+ 			'</table>'
					+		'</div>'
					+	'</div>'
					+ 	'<div class="es-dialog-form-line" align="right">'
					+		'<button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button>'
					+	'</div>'
					+'</div>',
					plain: true,
					controller: ['$scope', function ($dialog) {
						if (item) {
							$dialog.item = item;
						} else {
							$dialog.item = {
								type: "STRING",
								name: "新建辅助信息",
								values: []
							}
						}

						$dialog.submit = function () {
							if (!item) {
								$scope.esTemplate.additionalItems.push($dialog.item);
							}
							$dialog.closeThisDialog();
						}

						$dialog.removeListingValue = function (idx) {
							$dialog.item.values.splice(idx, 1);
						}

						$dialog.addListingValue = function () {
							ngDialog.open({
								template: '<div class="es-dialog-content"><div class="es-dialog-form-line"><input class="form-control" style="width:300px;" placeholder="输入选项值" es-ids="txtValue"/></div>'
								+ '<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
								plain: true,
								controller: ['$scope', function ($digListingValue) {
									$digListingValue.submit = function () {
										$dialog.item.values.push($('[es-ids=txtValue]').val());
										$digListingValue.closeThisDialog();
									}
								}]
							});
						};
					}]
				});
			}

			$scope.removeAdditionalItem = function(index) {
				$scope.esTemplate.additionalItems.splice(index, 1);
			}
		}]
	}
});

EasyAssess.directives["esIqcPlan"]
	= EasyAssess.app.directive("esIqcPlan", function(ngDialog) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div class="es-form-group">'
							+	 '<div class="es-form-header"><span class="es-form-header-text">{{esTemplate.name}}</span></div>'
				  	  +	 '<table class="table table-striped">'
		          + 	'<thead><tr><th style="width:15%;">检测项目</th><th style="width:45%;">样本</th></tr></thead>'
		          +   '<tbody>'
		          +			'<tr ng-repeat="item in esTemplate.items">'
							+	'<td class="es-form-group-cell" style="vertical-align: middle;"><div>{{item.subject}} - {{item.unit}}</div></td>'
							+	'<td>'
							+		'<table>'
							+			'<tr>'
							+				'<td class="es-form-group-cell" ng-repeat="specimen in item.specimens"><table><tr><td><div class="btn btn-primary" style="width: auto;" ng-click="setSpecimenOptions(specimen)">{{specimen.number}}</div></td><td></td></tr></table></td>'
							+			'</tr>'
							+		'</table>'
							+	'</td>'
		          			+'</tr>'
							+'<tr>'
							+	'<td colspan="3">'
							+		'<table>'
							+			'<tr style="height: 30px;" ng-repeat="def in esTemplate.additionalItems track by $index">'
							+				'<td><div ng-bind="esTemplate.additionalItems[$index].name"></div></td>'
							+				'<td>:</td>'
							+				'<td style="padding:0px 10px 0px 10px;"><span style="width: 200px; height: 20px; display: block;" class="es-form-signature-line"></span></td>'
							+			'</tr>'
							+		'</table>'
							+	'</td>'
							+'</tr>'
		          +	 	'</tbody></table>'
		          + '</div>',
		scope: {
			esTemplate:"="
		},
		
		controller: ["$scope", function($scope, $element, $attrs){
			$scope.setSpecimenOptions = function(specimen) {
				ngDialog.open({
					template: '<div class="es-dialog-content">'
					+ 	'<div class="es-dialog-form-line">'
					+ 		'<select ng-model="specimen.type" es-ids="drpType" style="width:100%;" ng-model="type">'
					+			'<option value="S">定性</option>'
					+			'<option value="T">定量-靶值(%)</option>'
					+			'<option value="P">定量-靶值(n)</option>'
					+		'</select>'
					+ 	'</div>'
					+   '<div ng-if="specimen.type==\'S\'">'
					+			'<es-iqc-specimen-selection-settings es-specimen="specimen"></es-iqc-specimen-selection-settings>'
					+		'</div>'
					+   '<div ng-if="specimen.type==\'P\'">'
					+			'<es-iqc-specimen-target-value-settings es-specimen="specimen" es-type="T"></es-iqc-specimen-target-value-settings>'
					+		'</div>'
					+   '<div ng-if="specimen.type==\'T\'">'
					+			'<es-iqc-specimen-target-value-settings es-specimen="specimen" es-type="P"></es-iqc-specimen-target-value-settings>'
					+		'</div>'
					+ 	'<div class="es-dialog-form-line" align="right">'
					+			'<button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button>'
					+		'</div>'
					+'</div>',
					plain: true,
					controller: ['$scope', function ($dialog) {
						$dialog.specimen = angular.copy(specimen, {});
						$dialog.submit = function () {
							angular.copy($dialog.specimen, specimen);
							$dialog.closeThisDialog();
						}
					}]
				});
			}
		}]
	}
});
