var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormSubmit"]
    = EasyAssess.app.directive("esFormSubmit", function (esRequestService,ngDialog) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template:'<div>'
                     +'<es-form-page>'
                         +'<div>'
                            +'<button type="button" class="btn btn-primary" ng-click="save()">提交</button>'
                         +'</div>'
                         +'<div class="es-page-section">'
                            +'<es-form-header es-header="formHeader" es-editable="false"></es-form-header>'
                         +'</div>'
                         +'<div ng-repeat="group in template.groups" class="es-page-section">'
                             +'<es-form-group-edit es-group="group" es-data="helpData"></es-form-group-edit>'
                         +'</div>'
                     +'</es-form-page>'
                 +'</div>',
        scope: {
            esForm: "=",
            esType: "@"
        },

        controller: ["$scope","ngDialog", function($scope,ngDialog){
            if ($scope.esType == 'assess'){
                var url = EasyAssess.activeEnv['assess']() + 'template/' + $scope.esForm.securedAssessment.templateGuid;
                esRequestService.esGet(url).then(function(data){
                    $scope.template = data.data;
                });
            }else if($scope.esType == 'plan'){
                $scope.template = $scope.esForm.template;
            }


            $scope.formHeader = {
                name:$scope.esForm.formName
            }



            //$scope.helpData = $scope.esForm.securedAssessment.id ? 1 :$scope.esForm.securedAssessment.id;

            $scope.helpData = null;

            $scope.answer = {
                values:[],
                codes:[]
            };

            $scope.save = function(){
                ngDialog.openConfirm({
                    template:   '<div class="ngdialog-message">答案一旦提交无法修改,是否确定提交?</div>'
                    + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
                    plain: true
                }).then(
                    function(){
                        angular.forEach($scope.rawCodeList,function(rawCode){
                            delete rawCode['codeGuid']
                        });

                        $scope.answer.codes = $scope.rawCodeList;

                        var url = EasyAssess.activeEnv['assess']() + 'form/submit/' + $scope.esForm.id;
                        esRequestService.esPut(url, {"values":$scope.answer.values,"codes":$scope.answer.codes}).then(function(res){
                            $scope.$emit('submitted');
                        });
                    }
                );

            };

            $scope.rawCodeList = [];

            $scope.$on('$codeItemLookup_selected',function(e, data, attrs){
                var subjectGuid = attrs.subjectGuid;
                var codeGroupGuid = attrs.codeGroupGuid

                addCodeIntoList(e.targetScope, data, subjectGuid, codeGroupGuid);
            });

            $scope.$on('removeSpecimen',function(e,data){
                removeFromList(data);
            });

            $scope.$on("$rowguidLookup_selected",function(e,data){
            });

            $scope.$on('valueChanged',function(e,data){
                updateTheValueList(data);
            });

            function updateTheValueList(data){
                var updateCode = $scope.answer.values.find(function(item){
                    return (item.subjectGuid === data.subjectGuid) && (item.specimenCode === data.specimenCode);
                });

                if (updateCode){
                    updateCode.value = data.value
                }else{
                    $scope.answer.values.push(data);
                }
            }

            function removeFromList(data){
                $scope.answer.values = $scope.answer.values.filter(function(item){
                    return item.specimenCode != data;
                });
            }

            function addCodeIntoList(t, data, subjectGuid, codeGroupGuid){

                console.log(angular.toJson($scope.template))
                var codeItem = {
                    subject:{
                        subject: t.esSubject.item.subject,
                        unit: t.esSubject.item.unit
                    },
                    subjectGuid: t.esSubject.guid,
                    codeNumber:data.codeNumber,
                    codeName:data.name,
                    codeGroup: {
                        "name":data.group.name,
                        "id":data.group.id,
                        "guid":codeGroupGuid
                    },
                    codeGuid: t.esLookupGuid
                };

                var updatedItem = $scope.rawCodeList.find(function(item){
                    return item.codeGuid  == codeItem.codeGuid
                });

                if(updatedItem){
                    updatedItem.subject = codeItem.subject;
                    updatedItem.subjectGuid = codeItem.subjectGuid;
                    updatedItem.codeNumber = codeItem.codeNumber;
                    updatedItem.codeName = codeItem.codeName;
                    updatedItem.codeGroup = {
                        "name": codeItem.codeGroup.name,
                        "id": codeItem.codeGroup.id,
                        "guid":codeGroupGuid
                    }
                }else{
                    $scope.rawCodeList.push(codeItem);
                }
            }
        }],

    }
});
