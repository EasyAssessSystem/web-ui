/**
 * 
 */
var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormGroup"] 
	= EasyAssess.app.directive("esFormGroup", function(ngDialog) {
	
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div class="es-form-group">' 
				  +	 '<table class="table table-striped">'
		          + 	'<thead><tr><th style="width:15%;">检测分类</th><th style="width:45%;">样本</th><!--th style="width:40%;">编码组</th>--></tr></thead>'
		          +     '<tbody>'
		          +			'<tr>'
		          +				'<td>'
		          +					'<table>'
		          +						'<tr>'
		          +							'<td class="es-form-group-cell" valign="middle"><es-text-box es-content="{{esGroup.name}}" es-change-callback="nameChanged(val)" class="es-form-group-text" es-placeholder="请输入分组名"></es-text-box></td>'
		          +						'</tr>'
		          +						'<tr ng-repeat="row in esGroup.rows">'
		          +							'<td class="es-form-group-cell" valign="middle"><div>{{row.item.subject}} - {{row.item.unit}} <span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeRow(row.guid)"></span></div></td>'
		          +						'</tr>'
		          +					'</table>'
		          +				'</td>'
		          +				'<td>'
		          +					'<table>'
		          +						'<tr>'
		          +							'<td class="es-form-group-cell" ng-repeat="s_col in esGroup.specimens"><table><tr><td><es-text-box es-content="{{s_col.number}}" es-change-callback="specimenNumberChange(val, s_col)" class="es-form-group-title" es-placeholder=""></es-text-box></td><td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeColumn(s_col.guid,\'specimens\')"></span></td></tr></table></td><td><es-add-button style="min-width:50px;" es-ids="addSpecimen" es-text="样本" title="添加样本"></es-add-button></td>'
		          +						'</tr>'
		          +						'<tr ng-repeat="row in esGroup.rows">'
		          +							'<td class="es-form-group-cell" ng-repeat="s_col in esGroup.specimens"><es-form-expect-option ng-if="esType == \'assess\'" es-group-row="row" es-specimen-column="s_col"></es-form-expect-option><es-iqc-form-expect-option ng-if="esType.iqc" es-group-row="row" es-specimen-column="s_col"></es-iqc-form-expect-option></td>'
		          +						'</tr>'
		          +					'</table>'
		          +				'</td>'
							+  			'<td>'
							+					'<table>'
							+						'<tr>'
							+							'<td class="es-form-group-cell" ng-repeat="s_col in esGroup.codeGroups"><table><tr><td><span class="es-form-group-title">{{s_col.name}}</span></td><td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeColumn(s_col.guid,\'codeGroups\')"></span></td></tr></table></td><td><es-add-button style="min-width:80px;" es-ids="addCode" es-text="编码组" title="添加编码组"></es-add-button></td>'
							+						'</tr>'
							+						'<tr ng-repeat="row in esGroup.rows">'
							+							'<td class="es-form-group-cell" ng-repeat="s_col in esGroup.codeGroups"><div class="input-group span6"><span class="form-control" style="width:20px;"></span><span class="input-group-addon" style="width:20px;"><span class="glyphicon glyphicon-search"></span></span></div></td>'
							+						'</tr>'
							+					'</table>'
							+				'</td>'
		          +			'</tr>'
		          +			'<tr>'
		          +				'<td colspan="3" style="padding:5px 0px 5px 0px;">'
		          +					'<es-add-button es-ids="addItem" es-text="添加新项目" title="添加新项目"></es-add-button>'
		          +				'</td>'
		          +			'</tr>'
		          +	 	'</tbody></table>'
		          + '</div>',
		scope: {
			esGroup:"=",
			esType:"@?"
		},
		
		controller: ["$scope", function($scope, $element, $attrs){
			if (!$scope.esGroup.guid) {
				$scope.esGroup.guid = EasyAssess.utils.generateGUID();
			}

			$scope.specimenNumberChange = function(val, specimen) {
				specimen.number = val;
			}

			$scope.removeColumn = function(guid, set) {
				// remove columns
				var columns = $scope.esGroup[set];
				for (var i=0;i<columns.length;i++) {
					if (columns[i].guid == guid) {
						columns.splice(i, 1);
						break;
					}
				}

				//remove column for rows
				for (var n=0;n<$scope.esGroup.rows.length;n++) {
					var row = $scope.esGroup.rows[n];
					var key = (set=="specimens") ? "optionMap" : "codeMap";
					if (row[key] && row[key][guid]) {
						delete row[key][guid];
					}
				}
			}
			
			$scope.removeRow = function(guid) {
				for (var i=0;$scope.esGroup.rows.length;i++) {
					if ($scope.esGroup.rows[i].guid == guid) {
						$scope.esGroup.rows.splice(i, 1);
						break;
					}
				}
			}
			
			$scope.nameChanged = function(val) {
				$scope.esGroup.name = val;
			}
			
			$scope.isSetted = function(row, col) {
				var cell = row.optionMap[col.guid];
				if (cell) {
					if (cell.expectedValues && cell.expectedValues.length > 0) {
						return true;
					}
				}
				return false;
			}
			
			$scope.setSpecimenOptions = function(row, col) {
				ngDialog.open({
	                template: '<div class="es-dialog-content">'
	                		 + '<div style="height:350px;overflow:auto;">'
	                		 + '<div class="es-dialog-form-line">'
	                		 +	'<select es-ids="drpType" style="width:100%;" ng-model="type"><option value="S">定性</option><option value="V">定量</option></select>'
	                		 + '</div>'
	                		 + '<div es-ids="pnlSelect">'
	                		 +		'<div class="es-dialog-form-line">'
	                		 +      	'<span>正确值</span><a href="javascript:void(0)" style="padding-left:20px;" ng-click="addExpectedValue()">添加</a>'
	                		 + 		'</div>'
	                		 +		'<div class="es-dialog-form-line">'
	                		 +			'<table class="table table-striped">'
	       		          	 + 				'<thead><tr><th>答案值</th><th>分值</th></tr></thead>'
	       		          	 +				'<tbody>'
	       		          	 +					'<tr ng-repeat="ev in settings.expectedValues"><td>{{ev.value}}</td><td>{{ev.weight}}</td><td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeExpectedValue(ev.value)"></span></td></tr>'
	       		          	 +				'</tbody>'
	       		          	 +			'<table>'
	                		 + 		'</div>'
	                		 + '</div>'
	                		 + '<div es-ids="pnlValue" ng-if="type==\'S\'">'
	                		 +		'<div class="es-dialog-form-line">'
	                		 +			'<span>选项值</span><a href="javascript:void(0)" style="padding-left:20px;" ng-click="addOptionValue()">添加</a>'
	                		 +      '</div>'
	                		 +		'<div class="es-dialog-form-line">'
	                		 +			'<table class="table table-striped"  ng-if="type==\'S\'">'
	       		          	 + 				'<thead><tr><th>选项</th></tr></thead>'
	       		          	 +				'<tbody>'
	       		          	 +					'<tr ng-repeat="ov in settings.optionValues"><td>{{ov.value}}</td><td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeOptionValue(ov.value)"></span></td></tr>'
	       		          	 +				'</tbody>'
	       		          	 +			'<table>'
	                		 + 		'</div>'
	                		 + '</div>'
	                		 + '</div>'
	                		 + '<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
	                plain: true,
	                controller: ['$scope', function($dialog) {

	                	if (!$dialog.type) {
	                		if (row.optionMap && row.optionMap[col.guid]) {
	                			$dialog.type = row.optionMap[col.guid].type;
	                			$dialog.settings = row.optionMap[col.guid];
	                		} else {
	                			$dialog.settings = {
	                				expectedValues: []
	                			}
	                			$dialog.type = "S";
	                		}
	                	}

	                	$dialog.removeExpectedValue = function(val) {
	                		for (var i=0;i<$dialog.settings.expectedValues.length;i++) {
	                			if ($dialog.settings.expectedValues[i].value == val) {
	                				$dialog.settings.expectedValues.splice(i,1);
	                				break;
	                			}
	                		}
	                	}

	                	$dialog.removeOptionValue = function(val) {
	                		for (var i=0;i<$dialog.settings.optionValues.length;i++) {
	                			if ($dialog.settings.optionValues[i].value == val) {
	                				$dialog.settings.optionValues.splice(i,1);
	                				break;
	                			}
	                		}
	                	}

	                	$dialog.submit = function(){
	                		if ($dialog.type == "S" && !$dialog.settings.optionValues) {
	                			$dialog.settings.optionValues = [];
	                		} else if ($dialog.type == "V") {
	                			delete $dialog.settings.optionValues;
	                		}
	                		$dialog.settings.type = $dialog.type;
	                		row.optionMap[col.guid] = $dialog.settings;
	                    	$dialog.closeThisDialog();
	                    }
	                	
	                	
	                	$dialog.addExpectedValue = function() {
							ngDialog.open({
								template: '<div class="es-dialog-content"><div class="es-dialog-form-line"><input class="form-control" style="width:300px;" placeholder="输入答案值" es-ids="txtValue"/></div>'
								+ '<div class="es-dialog-form-line"><input class="form-control" style="width:300px;" placeholder="输入得分值" es-ids="txtWeight"/></div>'
								+ '<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
								plain: true,
								controller: ['$scope', function ($digExepectedValue) {
									$digExepectedValue.submit = function () {
										$dialog.settings.expectedValues.push({
											"value": $('[es-ids=txtValue]').val(),
											"weight": Number($('[es-ids=txtWeight]').val())
										});
										$digExepectedValue.closeThisDialog();
									}
								}]
							});
	                	};
	                	
	                	$dialog.addOptionValue = function() {
	                		ngDialog.open({
	    		                template: '<div class="es-dialog-content"><div class="es-dialog-form-line"><input class="form-control" style="width:300px;" placeholder="输入选项值" es-ids="txtValue"/></div>'
	    		                		+ '<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
	    		                plain: true,
	    		                controller: ['$scope', function($digOptionValue) {
	    		                	$digOptionValue.submit = function(){
	    		                		if (!$dialog.settings.optionValues) {
	    		                			$dialog.settings.optionValues = [];
	    		                		}
	    		                		$dialog.settings.optionValues.push({
	    		                			"value":$('[es-ids=txtValue]').val()
	    		                		});
	    		                		$digOptionValue.closeThisDialog();
	    		                    }
	    		                }]
	                		 });
	                	};
	                }]
				});
			}
		}],
		link: function($scope, ele, attrs, ctrl) {
			 var btnAddSpecimen = $(ele).find('[es-ids=addSpecimen]');
			 var btnAddCode = $(ele).find('[es-ids=addCode]');
			 var btnAddItem = $(ele).find('[es-ids=addItem]');
			 
			 function isDuplicated(field, set) {
				for (var i=0;i<set.length;i++) {
					if (set[i].number == field) return true;
					if (set[i].model == field) return true;
				}
				return false;
			 }

			 // add specimen
			 btnAddSpecimen.on("click", function() {
				 ngDialog.open({
		                template: '<div class="es-dialog-content">'
					 							       +'<div ng-repeat="input in inputs" class="es-dialog-form-line">'
										           +	'样本组成-{{$index+1}}:<input class="form-control es-specimen-input" placeholder="请输入样本编号"/>'
					  									 +'</div>'
															 +'<div class="es-dialog-form-line" align="right">'
															 +	'<es-add-button ng-click="addSubSpecimen()" es-text="添加混合样本号"></es-add-button>'
															 +'</div>'
															 +'<div class="es-dialog-form-line" align="left">'
															 +	'<es-app-checkbox style="padding-top:5px;" es-model="copyFromOther" es-label="从其他样本复制"></es-app-checkbox>'
															 +  '<div ng-if="copyFromOther">'
										           +		'<select es-ids="sourceSpecimen" class="form-control es-form-group-contorl"><option ng-repeat="option in specimens" value="{{option.guid}}">{{option.number}}</option></select>'
															 +  '</div>'
															 +'</div>'
		                		 			 +'<div class="es-dialog-form-line" align="right">'
										           +	'<button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button>'
					 										 +'</div>'
					 										 +'</div>',
		                plain: true,
		                scope: $scope,
		                controller: ['$scope', function($dialog) {
											$dialog.inputs = [0];
											$dialog.specimens = $scope.esGroup.specimens;
											$dialog.copyFromOther = false;

											$dialog.addSubSpecimen = function() {
												$dialog.inputs.push($dialog.inputs.length);
											}

		                	$dialog.submit = function() {
												var inputs = $(".es-specimen-input");
												var number = '';
												inputs.each(function(){
													if (number) {
														number += "+" + $(this).val();
													} else {
														number = $(this).val();
													}
												});

		                		if (number && !isDuplicated(number, $scope.esGroup.specimens)) {
													var newSpecimen = {
														"guid": EasyAssess.utils.generateGUID(),
														"number": number
													};

													$scope.esGroup.specimens.push(newSpecimen);

													if ($dialog.copyFromOther) {
														var sourceSpecimenGuid = $('[es-ids=sourceSpecimen]').val();
														$scope.esGroup.rows.forEach(function (item) {
															var settings = item.optionMap[sourceSpecimenGuid];
															if (settings) {
																item.optionMap[newSpecimen.guid] = angular.extend({}, settings);
															}
														});
													}
		                		}
												$dialog.closeThisDialog();
											}
		                }],
		                preCloseCallback: function() {
		                	
		                }
		         });
			 });
			 
			 // add code group
			 btnAddCode.on("click", function() {
				 ngDialog.open({
					 template: '<div class="es-dialog-content"><div class="es-dialog-form-line"><es-app-lookup es-label="代码组" es-resource="group" es-columns="groupFields" es-id="groupLookup" es-value-field="name"></es-app-lookup></div>'
					 +'<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
					 plain: true,
					 scope: $scope,
					 controller: ['$scope', function($dialog) {
						 $dialog.groupFields = [
							 {title:"名称", field:"name", type:"string",searchable:true,default:true}
						 ];
						 $dialog.$on('$groupLookup_selected', function(e, model){
							 $dialog.codeGroup = model;
						 });
						 $dialog.submit = function(){
							 if ($dialog.codeGroup) {
								 if (!$scope.esGroup.codeGroups) {
									 $scope.esGroup.codeGroups = [];
								 }
								 $scope.esGroup.codeGroups.push({
									 "name":$dialog.codeGroup.name,
									 "id":$dialog.codeGroup.id,
									 "guid": EasyAssess.utils.generateGUID()
								 });
							 }
							 $dialog.closeThisDialog();
						 }
					 }]
				 });
			 });
			
			 //add item
			 btnAddItem.on("click", function() {
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
		                		$scope.esGroup.rows.push({
		                			"guid": EasyAssess.utils.generateGUID(),
		                			"item": {
			                			"subject": $dialog.activeModel.name,
										//"code":$dialog.activeModel.code,
			                			"unit": unit 
		                			},
		                			"optionMap": {
		                				
		                			}
		                		});
		                		$dialog.closeThisDialog();
		                    };
		                    
		                    $dialog.units = EasyAssess.units;
		                }],
		                preCloseCallback: function() {
		                	
		                }
		         });
			 });
		}
	}

});
