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
        +  			'<td>'
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
        +       '<td>'
        +          '<table cellpadding="10" cellspacing="10" style="width: 100%;">'
        +						'<tr>'
        +							'<td class="es-form-group-cell"><span class="es-form-group-title">试剂批号</span></td>'
        +							'<td class="es-form-group-cell"><span class="es-form-group-title">试剂有效期</span></td>'
        //+							'<td class="es-form-group-cell"><span class="es-form-group-title">检测日期</span></td>'
        +						'</tr>'
        +            '<tr style="height: 46px;" ng-repeat="row in esGroup.rows">'
        +               '<td class="es-form-group-cell"><input class="es-form-signature-line" ng-blur="detailChanged(row, \'batchNumber\' ,$event)" placeholder="输入试剂批号"/></td>'
        +               '<td class="es-form-group-cell"><input class="es-form-signature-line" ng-blur="detailChanged(row, \'expire\', $event)" placeholder="输入有效期"/></td>'
        // +               '<td class="es-form-group-cell"><es-app-calendar es-id="row" es-date="testDate" es-holder="请输入时间"></es-app-calendar></td>'
        +            '</tr>'
        +           '</table>'
        +       '</td>'
        +			'</tr>'
        +	 	'</tbody></table>'
        +   '<table style="width: 100%;">'
        +       '<tr>'
        +           '<td style="width: 60%;"></td>'
        +           '<td align="right" class="es-form-group-cell"><input class="es-form-signature-line" ng-blur="signatureChanged(\'tester\' ,$event)" placeholder="输入检测人"/></td>'
        +           '<td align="center" class="es-form-group-cell"><es-app-calendar es-id="testDate" es-date="testDate" es-holder="请输入检测日期"></es-app-calendar></td>'
        +       '</tr>'
        +       '<tr>'
        +           '<td style="width: 60%;"></td>'
        +           '<td align="right" class="es-form-group-cell"><input class="es-form-signature-line" ng-blur="signatureChanged(\'reviewer\' ,$event)" placeholder="输入审核人"/></td>'
        +           '<td align="center" class="es-form-group-cell"><es-app-calendar es-id="reviewDate" es-date="reviewDate" es-holder="请输入审核日期"></es-app-calendar></td>'
        +       '</tr>'
        +   '</table>'
        + '</div>',

        controller: ["$scope", function($scope, $element, $attrs){
            $scope.codeFields = [
                {title:"代码", field:"codeNumber", type:"string",searchable:true,default:true},
                {title:"名称", field:"name", type:"string",searchable:true,default:false},
                {title:"代码组", field:"groupName", type:"string",searchable:true, default:false,cascadeField:"group.name"}
            ];

            $scope.codeGroups = [];

            $scope.formatDate = function (date) {
                function pad(n) {
                    return n < 10 ? '0' + n : n;
                }
                return date && date.getFullYear()
                  + '-' + pad(date.getMonth() + 1)
                  + '-' + pad(date.getDate());
            };

            $scope.hideDate = true;

            $scope.closeDate = function () {
                $scope.hideDate = true;
            };

            $scope.openDate = function () {
                $scope.hideDate = false;
            };

            $scope.detailChanged = function(row, field ,e){
                var targetValue = $(e.target).val();
                var value = {
                    subjectGuid:row.guid,
                    value:targetValue
                };
                $scope.$emit(field + 'Changed',value);
            };

            $scope.signatureChanged = function(field ,e){
                var targetValue = $(e.target).val();
                var value = {
                    groupGuid: $scope.esGroup.guid,
                    value: targetValue,
                    field: field
                };
                $scope.$emit('signatureChanged',value);
            };

            $scope.$on('$testDate_DateTimeSelected',function(e, data){
                var value = {
                    groupGuid: $scope.esGroup.guid,
                    value: data["value"],
                    field: 'testDate'
                };
                $scope.$emit('signatureChanged',value);
            });

            $scope.$on('$reviewDate_DateTimeSelected',function(e, data){
                var value = {
                    groupGuid: $scope.esGroup.guid,
                    value: data["value"],
                    field: 'reviewDate'
                };
                $scope.$emit('signatureChanged',value);
            });
        }],
        link: function($scope, ele, attrs, ctrl) {
        }
    }
});
