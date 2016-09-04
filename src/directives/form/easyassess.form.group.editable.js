/**
 *
 */
var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormGroupEdit"]
    = EasyAssess.app.directive("esFormGroupEdit", function (ngDialog,esRequestService) {

    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        scope: {
            esGroup:"=",
            esData:"=?",
            esType:"@"
        },
        template:'<div class="es-form-group">'
        +	 '<table class="table table-striped">'
        + 	'<thead><tr><th style="width:15%;">检测分类</th><th style="width:45%;">样本</th><th style="width:40%;">编码组</th></tr></thead>'
        +     '<tbody>'
        +			'<tr>'
        +				'<td>'
        +					'<table  border="0" cellspacing="0" cellpadding="0" style="float:left;">'
        +						'<tr>'
        +							'<td class="es-form-group-cell" valign="middle"></td>'
        +						'</tr>'
        +						'<tr ng-repeat="row in esGroup.rows" style="height: 46px;">'
        +							'<td class="es-form-group-cell" valign="middle"><div>{{row.item.subject}} - {{row.item.unit}} </div></td>'
        +						'</tr>'
        +					'</table>'
        +				'</td>'
        +				'<td>'
        +					'<es-form-group-specimens-assess ng-if="esType == \'assess\'" es-data="esData" es-group="esGroup"></es-form-group-specimens-assess>'
        +					'<es-form-group-specimens-track ng-if="esType != \'assess\'" es-data="esData" es-group="esGroup"></es-form-group-specimens-track>'
        +				'</td>'
        +  			    '<td>'
        +					'<table>'
        +						'<tr>'
        +							'<td class="es-form-group-cell" ng-repeat="group in esGroup.codeGroups"><table><tr><td><span class="es-form-group-title">{{group.name}}</span></td><td></td></tr></table></td><td></td>'
        +						'</tr>'
        +						'<tr ng-repeat="row in esGroup.rows">'
        +							'<td class="es-form-group-cell" ng-repeat="group in esGroup.codeGroups">'
        +                               '<es-app-lookup subject-guid="{{row.guid}}" code-group-guid="{{group.guid}}" es-resource="code/list/categorized?group_id={{group.id}}" es-columns="codeFields" es-width="100" es-id="codeItemLookup" es-subject="row" es-value-field="codeNumber"></es-app-lookup>'
        +                           '</td>'
        +						'</tr>'
        +					'</table>'
        +				'</td>'
        +			'</tr>'
        +	 	'</tbody></table>'
        + '</div>',

        controller: ["$scope", function($scope, $element, $attrs){
            $scope.codeFields = [
                {title:"代码", field:"codeNumber", type:"string",searchable:true,default:true},
                {title:"名称", field:"name", type:"string",searchable:true,default:false},
                {title:"代码组", field:"groupName", type:"string",searchable:true, default:false,cascadeField:"group.name"}
            ];

            $scope.codeGroups = [];
        }],
        link: function($scope, ele, attrs, ctrl) {
        }
    }
});
