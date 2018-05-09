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
            esForm:"=?",
            esType:"@"
        },
        template:'<div class="es-form-group">'
        +	 '<table class="table table-striped">'
        + 	'<thead><tr><th style="width:15%;">' + EasyAssess.lang.forms.group.categoryText + '</th><th style="width:45%;">' + EasyAssess.lang.forms.group.specimenText + '</th><th style="width:40%;">' + EasyAssess.lang.forms.group.codeGroupText + '</th></tr></thead>'
        +     '<tbody>'
        +			'<tr>'
        +				'<td>'
        +					'<table  border="0" cellspacing="0" cellpadding="0" style="float:left;">'
        +						'<tr>'
        +							'<td class="es-form-group-cell" valign="middle">{{esGroup.name}}</td>'
        +						'</tr>'
        +						'<tr ng-repeat="row in esGroup.rows" style="height: 46px;">'
        +							'<td class="es-form-group-cell" valign="middle"><div>{{row.item.subject}} - {{row.item.unit}} </div></td>'
        +						'</tr>'
        +					'</table>'
        +				'</td>'
        +				'<td>'
        +					'<es-form-group-specimens-assess ng-if="esType == \'assess\'" es-data="esData" es-form="esForm" es-group="esGroup"></es-form-group-specimens-assess>'
        +					'<es-form-group-specimens-track ng-if="esType != \'assess\'" es-data="esData" es-group="esGroup"></es-form-group-specimens-track>'
        +				'</td>'
        +  			'<td>'
        +					'<table>'
        +						'<tr>'
        +							'<td class="es-form-group-cell" ng-repeat="group in esGroup.codeGroups"><table><tr><td><span class="es-form-group-title">{{group.name}}</span></td><td></td></tr></table></td><td></td>'
        +						'</tr>'
        +						'<tr ng-repeat="row in esGroup.rows">'
        +							'<td class="es-form-group-cell" ng-repeat="group in esGroup.codeGroups">'
        +                 '<div style="min-height:46px;"><es-app-lookup ng-if="!row.disableCodeGroup" es-model="getCodeValue(row, group)" es-lookup-guid="{{row.guid}}-{{group.guid}}" subject-guid="{{row.guid}}" code-group-guid="{{group.guid}}" es-resource="code/list/categorized?group_id={{group.id}}&category_name={{row.item.subject}}" es-columns="codeFields" es-width="100" es-id="codeItemLookup" es-subject="row" es-value-field="codeNumber"></es-app-lookup></div>'
        +              '</td>'
        +						'</tr>'
        +					'</table>'
        +				'</td>'
        +       '<td>'
        +          '<table cellpadding="10" cellspacing="10" style="width: 100%;">'
        +						'<tr>'
        +							'<td class="es-form-group-cell"><span ng-if="!row.disableCodeGroup" class="es-form-group-title">' + EasyAssess.lang.forms.group.batchCodeText + '</span></td>'
        +							'<td class="es-form-group-cell"><span ng-if="!row.disableCodeGroup" class="es-form-group-title">' + EasyAssess.lang.forms.group.expireDateText + '</span></td>'
        //+							'<td class="es-form-group-cell"><span class="es-form-group-title">检测日期</span></td>'
        +						'</tr>'
        +            '<tr style="height: 46px;" ng-repeat="row in esGroup.rows">'
        +               '<td class="es-form-group-cell"><input ng-if="!row.disableCodeGroup" class="es-form-signature-line" value="{{getDetailValue(row, \'batchNumber\')}}" ng-blur="detailChanged(row, \'batchNumber\' ,$event)" placeholder="' + EasyAssess.lang.forms.group.inputBatchCodeText + '"/></td>'
        +               '<td class="es-form-group-cell"><input ng-if="!row.disableCodeGroup" class="es-form-signature-line" value="{{getDetailValue(row, \'expire\')}}" ng-blur="detailChanged(row, \'expire\', $event)" placeholder="' + EasyAssess.lang.forms.group.inputExpireDateText + '"/></td>'
        // +               '<td class="es-form-group-cell"><es-app-calendar es-id="row" es-date="testDate" es-holder="请输入时间"></es-app-calendar></td>'
        +            '</tr>'
        +           '</table>'
        +       '</td>'
        +			'</tr>'
        +	 	'</tbody></table>'
        +   '<table style="width: 100%;">'
        +       '<tr>'
        +           '<td style="width: 60%;"></td>'
        +           '<td align="right" class="es-form-group-cell"><input value="{{getSignatureValue(\'tester\')}}" class="es-form-signature-line" ng-blur="signatureChanged(\'tester\' ,$event)" placeholder="' + EasyAssess.lang.forms.group.inputTesterText + '"/></td>'
        +           '<td align="center" class="es-form-group-cell"><es-app-calendar es-id="testDate" es-date="{{getSignatureValue(\'testDate\')}}" es-holder="' + EasyAssess.lang.forms.group.inputTestDateText + '"></es-app-calendar></td>'
        +       '</tr>'
        +       '<tr>'
        +           '<td style="width: 60%;"></td>'
        +           '<td align="right" class="es-form-group-cell"><input value="{{getSignatureValue(\'reviewer\')}}" class="es-form-signature-line" ng-blur="signatureChanged(\'reviewer\' ,$event)" placeholder="' + EasyAssess.lang.forms.group.inputReviewerText + '"/></td>'
        +           '<td align="center" class="es-form-group-cell"><es-app-calendar es-id="reviewDate" es-date="{{getSignatureValue(\'reviewDate\')}}" es-holder="' + EasyAssess.lang.forms.group.inputReviewDateText + '"></es-app-calendar></td>'
        +       '</tr>'
        +       '<tr>'
        +           '<td style="width: 60%;"></td>'
        +           '<td colspan="2">'
        +               '<span class="es-form-group-title" align="left">' + EasyAssess.lang.forms.group.commentText + ':</span>'
        +               '<textarea ng-blur="signatureChanged(\'comments\' ,$event)" class="form-control" rows="3">{{getSignatureValue(\'comments\')}}</textarea>'
        +           '</td>'
        +       '</tr>'
        +   '</table>'
        + '</div>',

        controller: ["$scope", function($scope, $element, $attrs){
            $scope.codeFields = [
                {title:EasyAssess.lang.forms.group.codeText, field:"codeNumber", type:"string",searchable:true,default:false},
                {title:EasyAssess.lang.forms.group.nameText, field:"name", type:"string",searchable:true,default:true},
                {title:EasyAssess.lang.forms.group.codeGroupText, field:"groupName", type:"string",searchable:true, default:false,cascadeField:"group.name"}
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

            $scope.getCodeValue = function (row, group) {
                if (!$scope.esForm) return null;
                var code = $scope.esForm.codes.find(function (c) {
                    return c.subjectGuid === row.guid && c.codeGroup.guid === group.guid;
                });
                if (!code) return null;
                return code.codeNumber;
            };

            $scope.getDetailValue = function(row, field){
                if (!$scope.esForm) return null;
                var detail = $scope.esForm.details.find(function (d) {
                    return d.subjectGuid === row.guid;
                });
                return detail ? detail[field] : null;
            };

            $scope.detailChanged = function(row, field ,e){
                var targetValue = $(e.target).val();
                var value = {
                    subjectGuid:row.guid,
                    value:targetValue
                };
                $scope.$emit(field + 'Changed',value);
            };

            $scope.getSignatureValue = function(field){
                if (!$scope.esForm) return null;
                if (!$scope.esForm.signatures[$scope.esGroup.guid]) return null;
                return $scope.esForm.signatures[$scope.esGroup.guid][field];
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
