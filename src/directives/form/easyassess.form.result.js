var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormResult"]
    = EasyAssess.app.directive("esFormResult", function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template: '<div>'
                    + '<div class="es-form-header"><span class="es-form-header-text">{{esForm.formName}}</span></div>'
                    +'<div style="padding-top:20px;padding-left:8px;"><table cellpadding="10" cellspacing="10" style="width: 100%;"><tr>'
                    +   '<td><span class="es-form-signature-line">检测人: {{esForm.tester}}</span></td>'
                    +   '<td><span class="es-form-signature-line">复审人: {{esForm.reviewer}}</span></td>'
                    +   '<td><span class="es-form-signature-line">检测日期: {{esForm.testDate}}</span></td>'
                    +'</tr></table></div>'
                    + '<div>'
                            + '<div class="es-page-section" ng-repeat="group in esTemplate.groups">'
                            + '<div class="es-form-group">'
                            +	 '<table class="table table-striped">'
                            + 	'<thead><tr><th style="width:15%;">检测分类</th><th style="width:45%;">样本</th><!--th style="width:40%;">编码组</th>--></tr></thead>'
                            +     '<tbody>'
                            +			'<tr>'
                            +				'<td>'
                            +					'<table>'
                            +						'<tr>'
                            +							'<td class="es-form-group-cell" valign="middle"><div ng-bind="{{esGroup.name}}" class="es-form-group-text"></div></td>'
                            +						'</tr>'
                            +						'<tr ng-repeat="row in group.rows">'
                            +							'<td class="es-form-group-cell" valign="middle"><div>{{row.item.subject}} - {{row.item.unit}} </div></td>'
                            +						'</tr>'
                            +					'</table>'
                            +				'</td>'
                            +				'<td>'
                            +					'<table>'
                            +						'<tr>'
                            +							'<td class="es-form-group-cell" ng-repeat="specimen in group.specimens"><span class="es-form-group-title">{{specimen.number}}</span></td>'
                            +						'</tr>'
                            +						'<tr ng-repeat="row in group.rows">'
                            +							'<td class="es-form-group-cell" ng-repeat="specimen in group.specimens"><span ng-bind="getValue(row, specimen)"></span></td>'
                            +						'</tr>'
                            +					'</table>'
                            +				'</td>'
                            +				'<td ng-if="group.rows.length > 0">'
                            +					'<table>'
                            +						'<tr>'
                            +							'<td class="es-form-group-cell" ng-repeat="codeGroup in group.codeGroups"><span class="es-form-group-title">{{codeGroup.name}}</span></td>'
                            +						'</tr>'
                            +						'<tr ng-repeat="row in group.rows">'
                            +							'<td class="es-form-group-cell" ng-repeat="codeGroup in group.codeGroups"><span>{{getCode(row, codeGroup)}}</span></td>'
                            +						'</tr>'
                            +					'</table>'
                            +				'</td>'
                            +			'</tr>'
                            +	 	'</tbody></table>'
                            + '</div>'
                        + '</div>'
                    + '</div>'
                + '</div>',
        scope: {
            esForm: "=",
            esTemplate: "="
        },

        controller: ["$scope", function($scope, $element, $attrs){
            $scope.valuesMap = {};
            $scope.codesMap = {};

            $scope.esForm.values.forEach(function(value) {
                $scope.valuesMap[value.subjectGuid + "+" + value.specimenGuid] = value.value;
            });

            $scope.esForm.codes.forEach(function(code) {
                if (!$scope.codesMap[code.subjectGuid]) {
                    $scope.codesMap[code.subjectGuid] = [];
                }
                $scope.codesMap[code.subjectGuid].push(code);
            });

            $scope.getValue = function(row, specimen) {
                return $scope.valuesMap[row.guid + "+" + specimen.guid];
            };

            $scope.getCode = function(row, group) {
                var codes = $scope.codesMap[row.guid];
                if (codes && codes.length) {
                    for (var i=0;i<codes.length;i++) {
                        if (codes[i].codeGroup.guid == group.guid) {
                            return codes[i].codeName;
                        }
                    }
                }
                return "";
            }
        }]
    }


});
