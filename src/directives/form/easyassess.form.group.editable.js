/**
 *
 */
var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormGroupEdit"]
    = EasyAssess.app.directive("esFormGroupEdit", function (ngDialog) {

    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template: '<div class="es-form-group">'
        + '<table class="table table-striped">'
        + '<thead><tr><th style="width:20%;">检测分类</th><th style="width:40%;">样本</th></tr></thead>'
        + '<tbody>'
        + '<tr>'
        + '<td>'
        + '<table>'
        + '<tr>'
        + '<td class="es-form-group-cell" valign="middle"><span>{{esGroup.name}}</span></td>'
        + '</tr>'
        + '<tr ng-repeat="row in esGroup.rows">'
        + '<td class="es-form-group-cell" valign="middle"><div>{{row.subject}} - {{row.unit}}</div></td>'
        + '</tr>'
        + '</table>'
        + '</td>'
        + '<td>'
        + '<table>'
        + '<tr>'
        + '<td class="es-form-group-cell" ng-repeat="s_col in esGroup.specimens"><table><tr><td><es-text-box es-content="{{s_col.number}}" es-change-callback="numberNameChanged(val,$index)" es-placeholder="样品码"></es-text-box></td></tr></table></td>'
        + '</tr>'
        + '<tr ng-repeat="row in esGroup.rows">'
        + '<td class="es-form-group-cell" ng-repeat="s_col in esGroup.specimens"><div ng-click="setAnswer(row, $index)" class="btn btn-default">{{answer}}</div></td>'
        + '</tr>'
        + '</table>'
        + '</td>'
        + '</tr>'
        + '</tbody></table>'
        + '</div>',
        scope: {
            esGroup: "="
        },

        controller: ["$scope", function ($scope, $element, $attrs) {

            $scope.numberNameChanged = function (val, $index) {
                var fakeCodeobj = {guid:$index,fakeCode:val};
                $scope.$emit("fakeCodeChanged",fakeCodeobj);
            };

            $scope.setAnswer = function (row, $index) {
                $scope.value = {itemId: '', sampleId: '', value:''};
                $scope.value.sampleId = $index;
                $scope.value.itemId = row.guid;
                //console.log(row.optionMap[s_col.guid].optionValues.length);
                //if (row.optionMap[s_col.guid].optionValues.length == 0) {
                //    $scope.showTypeV = true;
                //} else {
                //    $scope.showTypeV = false;
                //    $scope.valueOptions = row.optionMap[s_col.guid].optionValues;
                //}


                var dg = ngDialog.open({
                    template:'<div class="=s-dialog-content">'
                    +'<form>'
                    +'<div class="form-group" ng-show="true">'
                    +'<label>请输入答案</label>'
                    +'<input type="text" class="form-control" ng-model="filledValue">'
                    + '</div>'
                    //+ '<div class="form-group" ng-show="!showTypeV">'
                    //+'<label>请输入答案2</label>'
                    //+ '<select class="form-control" ng-model="filledValue"><option ng-repeat="option in valueOptions">{{option.value}}</option>'
                    //+ '</select>'
                    //+ '</div>'
                    + '<button ng-click="closePop()" class="btn btn-primary">确定</button>'
                    + '</form>',
                    plain: true,
                    scope:$scope,
                    controller:function($scope){
                        $scope.filledValue = '';
                        $scope.closePop = function(){
                            $scope.closeThisDialog($scope.filledValue);
                        }
                    }

                });

                dg.closePromise.then(function(data){
                    $scope.value.value = data.value;
                    $scope.$emit('valueChanged',$scope.value);
                });

            };

        }],
    }

});
