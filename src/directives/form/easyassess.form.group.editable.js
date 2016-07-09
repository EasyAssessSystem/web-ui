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
        template:'<div class="es-form-group">'
        +	 '<table class="table table-striped">'
        + 	'<thead><tr><th style="width:15%;">检测分类</th><th style="width:45%;">样本</th><!--th style="width:40%;">编码组</th>--></tr></thead>'
        +     '<tbody>'
        +			'<tr>'
        +				'<td>'
        +					'<table  border="0" cellspacing="0" cellpadding="0" style="float:left;">'
        +						'<tr>'
        +							'<td class="es-form-group-cell" valign="middle"></td>'
        +						'</tr>'
        +						'<tr ng-repeat="row in esGroup.rows">'
        +							'<td class="es-form-group-cell" valign="middle"><div>{{row.item.subject}} - {{row.item.unit}} </div></td>'
        +						'</tr>'
        +					'</table>'
        +				'</td>'
        +				'<td>'
        +					'<table  border="0" cellspacing="0" cellpadding="0" style="float:left;">'
        +						'<tr>'
        +							'<td class="es-form-group-cell" ng-repeat="s_col in specimens"><table><tr><td><span class="es-form-group-title">{{s_col.specimenCode}}</span></td><td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="removeColumn(s_col)"></span></td></tr></table></td><td><es-add-button style="min-width:50px;" es-ids="addSpecimen" es-text="样本" title="添加样本"></es-add-button></td>'
        +						'</tr>'
        +						'<tr ng-repeat="row in esGroup.rows">'
        +							'<td class="es-form-group-cell" ng-repeat="s_col in specimens"><div ng-show="{{isInput(row,s_col).show}}"><div ng-show="{{isInput(row,s_col).input}}"><input type="text" class="form-control es-form-group-contorl" ng-blur="valueChanged(row,s_col,$event)" ></div><div ng-show="{{isInput(row,s_col).select}}"><select class="form-control es-form-group-contorl" ng-blur="valueChanged(row,s_col,$event)"><option value=""></option><option ng-repeat="option in getOptions(row,s_col)" value="{{option.value}}">{{option.value}}</option></select></div></td>'
        +						'</tr>'
        +					'</table>'
        +				'</td>'
        +			'</tr>'
        +	 	'</tbody></table>'
        + '</div>',
        scope: {
            esGroup:"=",
            esData:"="
        },

        controller: ["$scope", function($scope, $element, $attrs){
            $scope.specimens = [

            ];

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
                    show:false,
                    input:false,
                    select:false
                };

                if(answserItem){
                    result.show = true;
                    if(answserItem.optionValues.length == 0){
                        result.input = true;

                    }else {
                        result.select = true;
                    }
                }

                return result;
            };

            $scope.removeColumn = function(specimen) {
                $scope.specimens.pop(specimen);
                $scope.$emit('removeSpecimen',specimen.specimenCode);
            };

            $scope.valueChanged = function(row,specimen,e){
                var filed = $(e.target).val();
                var value = {
                    subjectGuid:row.guid,
                    specimenCode:specimen.specimenCode,
                    value:filed
                };

                $scope.$emit('valueChanged',value);
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
                            // send the request to backend to get the options map:
                            var url = EasyAssess.activeEnv['assess']() + 'assessment/' +$scope.esData + '/specimen/guid/' +field;
                            esRequestService.esGet(url).then(function(res){
                                if(res.data.length >0){
                                    _updateSpecimanList(res.data, field);
                                }
                            });
                            $dialog.closeThisDialog();
                        }
                    }]
                });
            });

            function _updateSpecimanList(data,field){
                var speciman = {
                    specimenCode:field,
                    subjects:[]
                }

                angular.forEach($scope.esGroup.rows,function(item){
                    if(data in item.optionMap){
                        speciman.subjects.push({guid:item.guid, optionValues:item.optionMap[data].optionValues})
                    }
                });

                $scope.specimens.push(speciman);
            }

        }
    }


});
