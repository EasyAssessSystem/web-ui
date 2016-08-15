var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esIqcFormSelectionSettings"]
    = EasyAssess.app.directive("esIqcFormSelectionSettings", function(ngDialog) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template: 	    '<div>'
        + 		'<div class="es-dialog-form-line">'
        + 			'<span>选项值</span><a href="javascript:void(0)" style="padding-left:20px;" ng-click="addOptionValue()">添加</a>'
        + 		'</div>'
        + 		'<div class="es-dialog-form-line">'
        + 			'<table class="table table-striped">'
        + 				'<thead><tr><th>选项</th></tr></thead>'
        + 				'<tbody>'
        + 					'<tr ng-repeat="ov in esOption.optionValues"><td>{{ov.value}}</td><td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeOptionValue(ov.value)"></span></td></tr>'
        + 				'</tbody>'
        + 			'<table>'
        +		'</div>'
        +	'</div>',
        scope: {
            esOption: "="
        },

        controller: ["$scope", function($scope) {
            $scope.removeOptionValue = function (val) {
                for (var i = 0; i < $scope.esOption.optionValues.length; i++) {
                    if ($scope.esOption.optionValues[i].value == val) {
                        $scope.esOption.optionValues.splice(i, 1);
                        break;
                    }
                }
            }

            $scope.addOptionValue = function () {
                ngDialog.open({
                    template: '<div class="es-dialog-content"><div class="es-dialog-form-line"><input class="form-control" style="width:300px;" placeholder="输入选项值" es-ids="txtValue"/></div>'
                    + '<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
                    plain: true,
                    controller: ['$scope', function ($digOptionValue) {
                        $digOptionValue.submit = function () {
                            if (!$scope.esOption.optionValues) {
                                $scope.esOption.optionValues = [];
                            }
                            $scope.esOption.optionValues.push({
                                "value": $('[es-ids=txtValue]').val()
                            });
                            $digOptionValue.closeThisDialog();
                        }
                    }]
                });
            };
        }]
    }
});

EasyAssess.directives["esIqcFormTargetValueSettings"]
    = EasyAssess.app.directive("esIqcFormTargetValueSettings", function(ngDialog) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template: 	  '<div></div>',
        scope: {
            esOption: "="
        },
        controller: ["$scope", function($scope) {
        }]
    }
});

EasyAssess.directives["esIqcFormExpectOption"]
    = EasyAssess.app.directive("esIqcFormExpectOption", function(ngDialog) {

    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template:  '<div class="es-form-option">'
        +		'<div ng-show="!isSetted(esGroupRow,esSpecimenColumn)" ng-click="setSpecimenOptions(esGroupRow, esSpecimenColumn)" class="btn btn-danger es-expection-button">未设置</div>'
        + 		'<div ng-show="isSetted(esGroupRow,esSpecimenColumn)" ng-click="setSpecimenOptions(esGroupRow, esSpecimenColumn)" class="btn btn-success es-expection-button">已设置</div>'
        + '</div>',
        scope: {
            esGroupRow: "=",
            esSpecimenColumn: "="
        },

        controller: ["$scope", function($scope){
            $scope.isSetted = function(row, col) {
                var cell = row.optionMap[col.guid];
                if (typeof cell === 'undefined') {
                    return false;
                }else{
                    return true;
                }
            };

            $scope.setSpecimenOptions = function(row, col) {
                ngDialog.open({
                    template: '<div class="es-dialog-content">'
                    + 	'<div class="es-dialog-form-line">'
                    + 		'<select es-ids="drpType" ng-change="typeChanged()" style="width:100%;" ng-model="type">'
                    +			'<option value="S">定性</option>'
                    +			'<option value="T">定量</option>'
                    +		'</select>'
                    + 	'</div>'
                    +   '<div ng-if="type==\'S\'">'
                    +		'<es-iqc-form-selection-settings es-option="option"></es-iqc-form-selection-settings>'
                    +	'</div>'
                    +   '<div ng-if="type==\'T\'">'
                    +		'<es-iqc-form-target-value-settings es-option="option"></es-iqc-form-target-value-settings>'
                    +	'</div>'
                    + 	'<div class="es-dialog-form-line" align="right">'
                    +		'<button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button>'
                    +	'</div>'
                    +'</div>',
                    plain: true,
                    controller: ['$scope', function ($dialog) {
                        $dialog.option = angular.copy(row.optionMap[col.guid], {});
                        $dialog.type = $dialog.option.type ? $dialog.option.type : "S";
                        $dialog.typeChanged = function() {
                            $dialog.option.optionValues = [];
                        }

                        $dialog.submit = function () {
                            $dialog.option.type = $dialog.type;
                            row.optionMap[col.guid] = $dialog.option;
                            $dialog.closeThisDialog();
                        }
                    }]
                });
            }
        }]
    }
});
