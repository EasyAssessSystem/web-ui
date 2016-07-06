/**
 *
 */
var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormGroupEdit"]
    = EasyAssess.app.directive("esFormGroupEdit", function (ngDialog,esRequestService) {

    //return {
    //    restrict: 'E',
    //    replace: true,
    //    transclude: false,
    //    template: '<div class="es-form-group">'
    //    + '<table class="table table-striped">'
    //    + '<thead><tr><th style="width:20%;">检测分类</th><th style="width:40%;">样本</th></tr></thead>'
    //    + '<tbody>'
    //    + '<tr>'
    //    + '<td>'
    //    + '<table>'
    //    + '<tr>'
    //    + '<td class="es-form-group-cell" valign="middle"><span>{{esGroup.name}}</span></td>'
    //    + '</tr>'
    //    + '<tr ng-repeat="row in esGroup.rows">'
    //    + '<td class="es-form-group-cell" valign="middle"><div>{{row.subject}} - {{row.unit}}</div></td>'
    //    + '</tr>'
    //    + '</table>'
    //    + '</td>'
    //    + '<td>'
    //    + '<table>'
    //    + '<tr>'
    //    + '<td class="es-form-group-cell" ng-repeat="s_col in esGroup.specimens"><table><tr><td><es-text-box es-content="{{s_col.number}}" es-change-callback="numberNameChanged(val,$index)" es-placeholder="样品码"></es-text-box></td></tr></table></td>'
    //    + '</tr>'
    //    + '<tr ng-repeat="row in esGroup.rows">'
    //    + '<td class="es-form-group-cell" ng-repeat="s_col in esGroup.specimens"><div ng-click="setAnswer(row, $index)" class="btn btn-default">{{answer}}</div></td>'
    //    + '</tr>'
    //    + '</table>'
    //    + '</td>'
    //    + '</tr>'
    //    + '</tbody></table>'
    //    + '</div>',
    //    scope: {
    //        esGroup: "="
    //    },
    //
    //    controller: ["$scope", function ($scope, $element, $attrs) {
    //
    //        $scope.numberNameChanged = function (val, $index) {
    //            var fakeCodeobj = {guid:$index,fakeCode:val};
    //            $scope.$emit("fakeCodeChanged",fakeCodeobj);
    //        };
    //
    //        $scope.setAnswer = function (row, $index) {
    //            $scope.value = {itemId: '', sampleId: '', value:''};
    //            $scope.value.sampleId = $index;
    //            $scope.value.itemId = row.guid;
    //            //console.log(row.optionMap[s_col.guid].optionValues.length);
    //            //if (row.optionMap[s_col.guid].optionValues.length == 0) {
    //            //    $scope.showTypeV = true;
    //            //} else {
    //            //    $scope.showTypeV = false;
    //            //    $scope.valueOptions = row.optionMap[s_col.guid].optionValues;
    //            //}
    //
    //
    //            var dg = ngDialog.open({
    //                template:'<div class="=s-dialog-content">'
    //                +'<form>'
    //                +'<div class="form-group" ng-show="true">'
    //                +'<label>请输入答案</label>'
    //                +'<input type="text" class="form-control" ng-model="filledValue">'
    //                + '</div>'
    //                //+ '<div class="form-group" ng-show="!showTypeV">'
    //                //+'<label>请输入答案2</label>'
    //                //+ '<select class="form-control" ng-model="filledValue"><option ng-repeat="option in valueOptions">{{option.value}}</option>'
    //                //+ '</select>'
    //                //+ '</div>'
    //                + '<button ng-click="closePop()" class="btn btn-primary">确定</button>'
    //                + '</form>',
    //                plain: true,
    //                scope:$scope,
    //                controller:function($scope){
    //                    $scope.filledValue = '';
    //                    $scope.closePop = function(){
    //                        $scope.closeThisDialog($scope.filledValue);
    //                    }
    //                }
    //
    //            });
    //
    //            dg.closePromise.then(function(data){
    //                $scope.value.value = data.value;
    //                $scope.$emit('valueChanged',$scope.value);
    //            });
    //
    //        };
    //
    //    }],
    //}

    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template:  '<div class="es-form-group">'
        +	 '<table class="table table-striped">'
        + 	'<thead><tr><th style="width:20%;">检测分类</th><th style="width:40%;">样本</th><!--th style="width:40%;">编码组</th>--></tr></thead>'
        +     '<tbody>'
        +			'<tr>'
        +				'<td>'
        +					'<table>'
        +						'<tr>'
        +							'<td class="es-form-group-cell" valign="middle"></td>'
        +						'</tr>'
        +						'<tr ng-repeat="row in esGroup.rows">'
        +							'<td class="es-form-group-cell" valign="middle"><div>{{row.subject}} - {{row.unit}}</div></td>'
        +						'</tr>'
        +					'</table>'
        +				'</td>'
        +				'<td>'
        +					'<table>'
        +						'<tr>'
        +							'<td class="es-form-group-cell" ng-repeat="s_col in specimens"><table><tr><td><span class="es-form-group-title">{{s_col}}</span></td><td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeColumn(s_col)"></span></td></tr></table></td><td><es-add-button style="min-width:50px;" es-ids="addSpecimen" es-text="样本" title="添加样本"></es-add-button></td>'
        +						'</tr>'
        +						'<tr ng-repeat="row in esGroup.rows ">'
        +							'<td class="es-form-group-cell" ng-repeat="s_col in specimens"><div ng-show="isInputBox">input</div><div ng-show="!isInputBox">select</div></td>'
        +						'</tr>'
        +					'</table>'
        +				'</td>'
        +			'</tr>'
        +	 	'</tbody></table>'
        + '</div>',
        scope: {
            esGroup:"="
        },

        controller: ["$scope", function($scope, $element, $attrs){
            //edit("Hello");

            $scope.specimens = [];

            var specimen = {
                fakeId :'',

                subjects:[
                    {
                        guid:'',
                        optionValues:[{},{},{}]
                    },
                    {
                        guid:'',
                        optionValues:[]
                    }
                ]
            };

            $scope.isInputBox = function(subject,specimen){

                var selected =specimen.subjects.find(function(item){
                    return item.guid == subject.guid
                });

                var result = false;
                if(selected.optionValues.length == 0){
                    result = true

                }else {
                    result = false;
                }

                return result;
            }


            $scope.removeColumn = function(specimen) {
                $scope.specimens.pop(specimen);
                console.log($scope.specimens);
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

        }],
        link: function($scope, ele, attrs, ctrl) {
            var btnAddSpecimen = $(ele).find('[es-ids=addSpecimen]');

            // add specimen
            btnAddSpecimen.on("click", function() {
                ngDialog.open({
                    template: '<div class="es-dialog-content"><div class="es-dialog-form-line"><input class="form-control" placeholder="请输入样本编号" es-ids="txtSpecimenNumber"/></div>'
                    +'<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
                    plain: true,
                    scope: $scope,
                    controller: ['$scope','esRequestService',function($dialog,esRequestService) {
                        $dialog.submit = function(){
                            var field = $("[es-ids=txtSpecimenNumber]").val();
                            $scope.specimens.push(field);
                            // send the request to backend to get the options map:
                            //esRequestService.esGet(url).then(function(data){
                            //
                            //});

                            console.log($scope.specimens);
                            $dialog.closeThisDialog();
                        }
                    }],
                    preCloseCallback: function() {

                    }
                });
            });

            //// add code group
            //btnAddCode.on("click", function() {
            //    ngDialog.open({
            //        template: '<div class="es-dialog-content"><div class="es-dialog-form-line"><select es-ids="drpGroup" style="width:100%;"><option ng-repeat="group in groups" value="{{group.value}}">{{group.text}}</option></select></div>'
            //        +'<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
            //        plain: true,
            //        controller: ['$scope', function($dialog) {
            //            $dialog.submit = function(){
            //                var field = $("[es-ids=drpGroup]").val();
            //                if (field && !isDuplicated(field, $scope.esGroup.codes)) {
            //                    $scope.esGroup.codes.push({
            //                        "guid": EasyAssess.utils.generateGUID(),
            //                        "name":$("[es-ids=drpGroup]").find("option:selected").text(),
            //                        "model":field
            //                    });
            //                }
            //                $dialog.closeThisDialog();
            //            };
            //
            //            $dialog.groups = EasyAssess.codeGroups;
            //        }],
            //        preCloseCallback: function() {
            //
            //        }
            //    });
            //});
            //
            ////add item
            //btnAddItem.on("click", function() {
            //    ngDialog.open({
            //        template: '<div class="es-dialog-content">'
            //        +'<div class="es-dialog-form-line"><es-app-lookup es-value-field="name" es-label="检测项" es-columns="categoryFields" es-id="categoryLookup" es-resource="category"></es-app-lookup></div>'
            //        +'<div class="es-dialog-form-line"><select es-ids="drpUnits" style="width:100%;height:30px;"><option ng-repeat="unit in units" value="{{unit.value}}">{{unit.value}}</option></select></div>'
            //        +'<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
            //        plain: true,
            //        controller: ['$scope', function($dialog) {
            //            $dialog.categoryFields = [
            //                {title:"名称", field:"name", type:"string",searchable:true,default:true}
            //            ];
            //
            //            $dialog.$on('$categoryLookup_selected', function(e, model){
            //                $dialog.activeModel = model;
            //            });
            //
            //            $dialog.submit = function(){
            //                var unit = $("[es-ids=drpUnits]").val();
            //                $scope.esGroup.rows.push({
            //                    "guid": EasyAssess.utils.generateGUID(),
            //                    "item": {
            //                        "subject": $dialog.activeModel.name,
            //                        //"code":$dialog.activeModel.code,
            //                        "unit": unit
            //                    },
            //                    "optionMap": {
            //
            //                    }
            //                });
            //                $dialog.closeThisDialog();
            //            };
            //
            //            $dialog.units = EasyAssess.units;
            //        }],
            //        preCloseCallback: function() {
            //
            //        }
            //    });
            //});
        }
    }


});