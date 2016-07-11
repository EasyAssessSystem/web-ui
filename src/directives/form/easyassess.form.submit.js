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
                            +'<button type="button" class="btn btn-success" ng-click="save()">提交</button>'
                         +'</div>'
                         +'<div class="es-page-section">'
                            +'<es-form-header es-header="template.header" es-editable="false"></es-form-header>'
                         +'</div>'
                         +'<div ng-repeat="group in template.groups" class="es-page-section">'
                             +'<es-form-group-edit es-group="group" es-data="helpData"></es-form-group-edit>'
                         +'</div>'
                     +'</es-form-page>'
                 +'</div>',
        scope: {
            esForm: "="
        },

        controller: ["$scope","ngDialog", function($scope,ngDialog){
            var url = EasyAssess.activeEnv['assess']() + 'template/' + $scope.esForm.securedAssessment.templateGuid;
            esRequestService.esGet(url).then(function(data){
                $scope.template = data.data;
            });

            $scope.helpData = $scope.esForm.securedAssessment.id;

            $scope.answer = {
                values:[]
            };

            $scope.save = function(){
                ngDialog.openConfirm({
                    template:   '<div class="ngdialog-message">答案一旦提交无法修改,是否确定提交?</div>'
                    + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
                    plain: true
                }).then(
                    function(){
                        var url = EasyAssess.activeEnv['assess']() + 'form/submit/' + $scope.esForm.id;
                        esRequestService.esPut(url, {"values":$scope.answer.values,"codes":[]}).then(function(res){
                            $scope.$emit('submitted');
                        });
                    }
                );

            };

            $scope.$on('removeSpecimen',function(e,data){
                removeFromList(data);
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
        }]
    }
});
