/**
 *
 */
var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormGroupSpecimensAssess"]
    = EasyAssess.app.directive("esFormGroupSpecimensAssess", function (ngDialog,esRequestService) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        scope: {
            esGroup:"=",
            esData:"=?"
        },
        template:'<div>'
        +					'<table  border="0" cellspacing="0" cellpadding="0" style="float:left;">'
        +						'<tr>'
        +							'<td class="es-form-group-cell" ng-repeat="specimen in specimens"><table><tr><td class="es-add-button" style="min-width: 50px" ng-click="addNewSample(specimen)"><span>{{specimen.specimenCode}}</span></td><td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeColumn(specimen)"></span></td></tr></table></td>'
        +						'</tr>'
        +						'<tr ng-repeat="row in esGroup.rows" style="height: 46px;">'
        +							'<td class="es-form-group-cell" ng-repeat="specimen in specimens"><div ng-show="isInput(row, specimen).show ==\'true\'"><div ng-show="isInput(row, specimen).input==\'true\'"><input type="text" class="form-control es-form-group-contorl" ng-blur="valueChanged(row, specimen, $event)" ></div><div ng-show="isInput(row, specimen).select==\'true\'"><select class="form-control es-form-group-contorl" ng-blur="valueChanged(row, specimen, $event)"><option value=""></option><option ng-repeat="option in getOptions(row, specimen)" value="{{option.value}}">{{option.value}}</option></select></div></td>'
        +						'</tr>'
        +					'</table>'
        +        '</div>',

        controller: ["$scope", function($scope, $element, $attrs){
            $scope.specimens = [];
            for (var key in $scope.esGroup.specimens){
                var speciman = {
                    specimenCode:"样品",
                    subjects:[]
                };
                $scope.specimens.push(speciman);
            }

            $scope.removeColumn = function(specimen) {
                specimen.specimenCode = '样品';
                specimen.subjects = [];
                specimen.guid = null;
                $scope.$emit('removeSpecimen',specimen.specimenCode);
            };

            function _updateSpecimanList(data,field,speciman){
                speciman.specimenCode = field;
                speciman.guid = data;
                angular.forEach($scope.esGroup.rows,function(item){
                    if(data in item.optionMap){
                        speciman.subjects.push({guid:item.guid, optionValues:item.optionMap[data].optionValues})
                    }
                });
            }

            $scope.getOptions = function(row, specimen){
                var foundItem = specimen.subjects.find(function(subject){
                    return subject.guid == row.guid
                });
                var result = [];
                if(foundItem){
                    result = foundItem.optionValues;
                }
                return result;
            };

            $scope.isInput = function(subject, specimen){
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

            $scope.valueChanged = function(row, specimen, e){
                var field = $(e.target).val();
                var value = {
                    subjectGuid: row.guid,
                    specimenCode: specimen.specimenCode,
                    specimenGuid: specimen.guid,
                    value:field
                };
                $scope.$emit('valueChanged',value);
            };

            // add specimen
            $scope.addNewSample = function(speciman){
                ngDialog.open({
                    template: '<div class="es-dialog-content">'
                    +'<div ng-repeat="input in inputs" class="es-dialog-form-line">'
                    +	'样本组成-{{$index+1}}:<input class="form-control es-specimen-input" placeholder="请输入样本编号"/>'
                    +'</div>'
                    +'<div class="es-dialog-form-line" align="right">'
                    +	'<es-add-button ng-click="addSubSpecimen()" es-text="添加混合样本号"></es-add-button>'
                    +'</div>'
                    +'<div class="es-dialog-form-line" align="right">'
                    +	'<button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button>'
                    +'</div>'
                    +'</div>',
                    plain: true,
                    scope: $scope,
                    controller: ['$scope','esRequestService',function($dialog,esRequestService) {
                        $scope.error = {
                            flag:false,
                            msg:""
                        };

                        $dialog.inputs = [0];

                        $dialog.addSubSpecimen = function() {
                            $dialog.inputs.push($dialog.inputs.length);
                        }

                        $dialog.submit = function(){
                            var inputs = $(".es-specimen-input");
                            var number = '';
                            inputs.each(function(){
                                if (number) {
                                    number += "+" + $(this).val();
                                } else {
                                    number = $(this).val();
                                }
                            });
                            // send the request to backend to get the options map:
                            if(_verifyDuplicateValue(number)){
                                if($scope.esData){
                                    var url = EasyAssess.activeEnv['assess']() + 'assessment/' +$scope.esData + '/specimen/guid/' +number;
                                    esRequestService.esGet(url).then(function(res){
                                        if(res.data.length >0){
                                            _updateSpecimanList(res.data, number, speciman);
                                            $dialog.closeThisDialog();
                                        }else{
                                            EasyAssess.QuickMessage.error("无效的样本码");
                                        }
                                    });
                                }
                            }

                        }
                    }]
                });
            };

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
        }]
    }
});

EasyAssess.directives["esFormGroupSpecimensTrack"]
  = EasyAssess.app.directive("esFormGroupSpecimensTrack", function (ngDialog,esRequestService) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        scope: {
            esGroup:"=",
            esData:"=?"
        },
        template:'<div>'
        +					'<table  border="0" cellspacing="0" cellpadding="0" style="float:left;">'
        +						'<tr>'
        +							'<td class="es-form-group-cell" ng-repeat="specimen in esGroup.specimens"><table><tr><td><span>{{specimen.number}}</span></td></tr></table></td>'
        +						'</tr>'
        +						'<tr ng-repeat="row in esGroup.rows" style="height: 46px;">'
        +							'<td class="es-form-group-cell" ng-repeat="specimen in esGroup.specimens"><div ng-show="isInput(row, specimen).show ==\'true\'"><div ng-show="isInput(row, specimen).input==\'true\'"><input type="text" class="form-control es-form-group-contorl" ng-blur="valueChanged(row, specimen, $event)" ></div><div ng-show="isInput(row, specimen).select==\'true\'"><select class="form-control es-form-group-contorl" ng-blur="valueChanged(row, specimen, $event)"><option value=""></option><option ng-repeat="option in getOptions(row, specimen)" value="{{option.value}}">{{option.value}}</option></select></div></td>'
        +						'</tr>'
        +					'</table>'
        +        '</div>',

        controller: ["$scope", function($scope, $element, $attrs){
            $scope.getOptions = function(row, specimen){
                return row.optionMap[specimen.guid].optionValues;
            };

            $scope.valueChanged = function(row, specimen, e){
                var field = $(e.target).val();
                var value = {
                    subjectGuid:row.guid,
                    specimenCode:specimen.number,
                    value:field,
                    specimenGuid: specimen.guid,
                    specimenNumber: specimen.number,
                    subject: row.item
                };
                $scope.$emit('valueChanged',value);
            };

            $scope.isInput = function(row, specimen){
                var answserItem = row.optionMap[specimen.guid];

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
        }]
    }
});
