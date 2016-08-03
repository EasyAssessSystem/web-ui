var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormResult"]
    = EasyAssess.app.directive("esFormResult", function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template: '<div>'
                    + '<div class="es-form-header"><span class="es-form-header-text">{{esTemplate.header.name}}</span></div>'
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
                            +							'<td class="es-form-group-cell" ng-repeat="title in getCodeGroupTitles(group) track by $index"><span class="es-form-group-title">{{title}}</span></td>'
                            +						'</tr>'
                            +						'<tr ng-repeat="row in group.rows">'
                            +							'<td class="es-form-group-cell" ng-repeat="code in getCodes(row)"><span>{{code.codeName}}</span></td>'
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
            }

            $scope.getCodes = function(row) {
                return $scope.codesMap[row.guid];
            }

            $scope.getCodeGroupTitles = function(group) {
                var titles = [];

                if (group.rows.length > 0) {
                    var codes = $scope.getCodes(group.rows[0]);
                    if (codes) {
                        codes.forEach(function(code) {
                            titles.push(code.codeGroup.name);
                        });
                    }
                }

                return titles;
            }
        }]
    }


});
