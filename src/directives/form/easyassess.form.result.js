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
                            + 	'<thead><tr><th style="width:20%;">检测分类</th><th style="width:40%;">样本</th><!--th style="width:40%;">编码组</th>--></tr></thead>'
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
                            +							'<td class="es-form-group-cell" ng-repeat="s_col in group.specimens"><span class="es-form-group-title">{{s_col.number}}</span></td>'
                            +						'</tr>'
                            +						'<tr ng-repeat="row in group.rows">'
                            +							'<td class="es-form-group-cell" ng-repeat="s_col in group.specimens"></td>'
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

        }]
    }


});
