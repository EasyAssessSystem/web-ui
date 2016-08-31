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
            esData:"=?"
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
        +					'<table  border="0" cellspacing="0" cellpadding="0" style="float:left;">'
        +						'<tr>'
        +							'<td class="es-form-group-cell" ng-repeat="s_col in specimens"><table><tr><td class="es-add-button" style="min-width: 50px" ng-click="addNewSample(s_col)"><span>{{s_col.specimenCode}}</span></td><td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeColumn(s_col)"></span></td></tr></table></td>'
        +						'</tr>'
        +						'<tr ng-repeat="row in esGroup.rows" style="height: 46px;">'
        +							'<td class="es-form-group-cell" ng-repeat="s_col in specimens"><div ng-show="isInput(row,s_col).show ==\'true\'"><div ng-show="isInput(row,s_col).input==\'true\'"><input type="text" class="form-control es-form-group-contorl" ng-blur="valueChanged(row,s_col,$event)" ></div><div ng-show="isInput(row,s_col).select==\'true\'"><select class="form-control es-form-group-contorl" ng-blur="valueChanged(row,s_col,$event)"><option value=""></option><option ng-repeat="option in getOptions(row,s_col)" value="{{option.value}}">{{option.value}}</option></select></div></td>'
        +						'</tr>'
        +					'</table>'
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

            $scope.specimens = [
            ];
            for (each in $scope.esGroup.specimens){
                var speciman = {
                    specimenCode:"样品",
                    subjects:[]
                };
                $scope.specimens.push(speciman);
            }

            $scope.codeFields = [
                {title:"代码", field:"codeNumber", type:"string",searchable:true,default:true},
                {title:"名称", field:"name", type:"string",searchable:true,default:false},
                {title:"代码组", field:"groupName", type:"string",searchable:true, default:false,cascadeField:"group.name"}
            ];

            $scope.codeGroups = [];

            $scope.getOptions = function(row,specimen){
                var foundItem = specimen.subjects.find(function(subject){
                    return subject.guid == row.guid
                });
                var result = [];
                if(foundItem){
                    result = foundItem.optionValues;
                }

                return result;
            };

            $scope.isInput = function(subject,specimen){
                var answserItem = specimen.subjects.find(function(item){
                    return item.guid == subject.guid
                });

                var result = {
                    show:'false',
                    input:false,
                    select:false
                };

                if(answserItem){
                    result.show = 'true';
                    if(answserItem.optionValues.length == 0){
                        result.input = 'true';

                    }else {
                        result.select = 'true';
                    }
                }

                return result;
            };

            $scope.removeColumn = function(specimen) {
                specimen.specimenCode = '样品';
                specimen.subjects = [];
                $scope.$emit('removeSpecimen',specimen.specimenCode);
            };

            $scope.valueChanged = function(row,specimen,e){
                var field = $(e.target).val();
                var value = {
                    subjectGuid:row.guid,
                    specimenCode:specimen.specimenCode,
                    value:field
                };
                $scope.$emit('valueChanged',value);
            }

            // $scope.addGroup = function() {
            //     ngDialog.open({
            //         template: '<div class="es-dialog-content"><div class="es-dialog-form-line"><es-app-lookup es-label="代码组" es-resource="group" es-columns="groupFields" es-id="groupLookup" es-value-field="name"></es-app-lookup></div>'
            //                  +'<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
            //         plain: true,
            //         scope: $scope,
            //         controller: ['$scope', function($dialog) {
            //             $dialog.groupFields = [
            //                 {title:"名称", field:"name", type:"string",searchable:true,default:true}
            //             ];
            //             $dialog.$on('$groupLookup_selected', function(e, model){
            //                 $dialog.codeGroup = model;
            //             });
            //             $dialog.submit = function(){
            //                 if ($dialog.codeGroup) {
            //                     $scope.codeGroups.push($dialog.codeGroup);
            //                 }
            //                 $dialog.closeThisDialog();
            //             }
            //         }]
            //     });
            // }

            // add specimen
            $scope.addNewSample = function(speciman){
                ngDialog.open({
                    template: '<div class="es-dialog-content"><div class="es-dialog-form-line" ng-class="error.flag ? \'has-error\' :\'\' "><input class="form-control" placeholder="请输入样本编号" es-ids="txtSpecimenNumber"/><div ng-if="error.flag" style="color: #a94442"><span>{{error.msg}}</span></div></div>'
                    +'<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
                    plain: true,
                    scope: $scope,
                    controller: ['$scope','esRequestService',function($dialog,esRequestService) {
                        $scope.error = {
                            flag:false,
                            msg:""
                        };
                        $dialog.submit = function(){
                            var field = $("[es-ids=txtSpecimenNumber]").val();
                            // send the request to backend to get the options map:

                            if(_verifyDuplicateValue(field)){
                                var url = EasyAssess.activeEnv['assess']() + 'assessment/' +$scope.esData + '/specimen/guid/' +field;
                                esRequestService.esGet(url).then(function(res){
                                    if(res.data.length >0){
                                        _updateSpecimanList(res.data, field,speciman);
                                        $dialog.closeThisDialog();

                                    }else{
                                        $scope.error = {
                                            flag:true,
                                            msg:"请输入有效的样本码!"
                                        };
                                    }
                                });
                            }

                        }
                    }]
                });
            };


            // this function is just for plan
            function _updateSpecimanListForPlan(field,speciman){
                speciman.specimenCode = field;
                var data = '';
                angular.forEach($scope.esGroup.specimens,function(specimen){
                    if (specimen['number'] == field){
                        return data = specimen.guid;
                    }
                });
                console.log(data);
                angular.forEach($scope.esGroup.rows,function(item){
                    if(data in item.optionMap){
                        speciman.subjects.push({guid:item.guid, optionValues:item.optionMap[data].optionValues})
                    }
                });
            }


            // this function is for assess
            function _updateSpecimanList(data,field,speciman){
                speciman.specimenCode = field;
                angular.forEach($scope.esGroup.rows,function(item){
                    if(data in item.optionMap){
                        speciman.subjects.push({guid:item.guid, optionValues:item.optionMap[data].optionValues})
                    }
                });
            }

            function  _verifyDuplicateValue(field){
                var result = true
                angular.forEach($scope.specimens,function(sepcimen){
                    if(field == sepcimen.specimenCode){
                        $scope.error = {
                            flag:true,
                            msg:"请勿重复输入!"
                        };
                        result = false
                    }
                });
                return result;
            }




        }],
        link: function($scope, ele, attrs, ctrl) {
        }
    }


});
