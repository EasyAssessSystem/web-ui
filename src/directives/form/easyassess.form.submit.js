var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormSubmit"]
    = EasyAssess.app.directive("esFormSubmit", function (esRequestService,ngDialog,Upload) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template:'<div>'
                     +'<es-form-page>'
                         +'<div>'
                            +'<button type="button" class="btn btn-primary" ng-click="submit()">提交</button>'
                            +'<button type="button" class="btn btn-primary" ng-click="manageAttachment()">上传附件</button>'
                            //+'<button ng-if="esType!=\'plan\'" type="button" class="btn btn-primary" ng-click="save()">保存</button>'
                         +'</div>'
                         +'<es-app-tab-pane>'
                         + '<es-app-tab es-active="true" es-ref="formView" es-title="表单">'
                            +'<div class="es-page-section">'
                            +'<es-form-header es-header="formHeader" es-editable="false"></es-form-header>'
                            +'</div>'
                            +'<div style="position: relative">'
                            +'<div style="width: 100%; overflow-x:auto; overflow-y: visible;">'
                            +'<div ng-repeat="group in template.groups" class="es-page-section">'
                            +'<es-form-group-edit es-type="{{esType}}" es-group="group" es-data="helpData"></es-form-group-edit>'
                            + '</div>'
                            +'</div>'
                            +   '<div style="padding: 10px 0px 10px 0px;">'
                            +      '<span class="es-form-group-title">填报说明:</span>'
                            +      '<es-form-footer ng-if="template" es-editable="false" es-footer="template.footer"></es-form-footer>'
                            +   '</div>'
                            +'</div>'
                         + '</es-app-tab>'
                         + '<es-app-tab es-ref="preView" es-title="预览">'
                         +    '<es-form-result ng-if="template && previewModel" es-form="previewModel" es-template="template"></es-form-result>'
                         + '</es-app-tab>'
                        +'</es-app-tab-pane>'
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
            };
            
            if ($scope.esType =='assess'){
                $scope.helpData =  $scope.esForm.securedAssessment.id;
            }else{
                $scope.helpData = null;
            }

            $scope.manageAttachment = function () {
                ngDialog.open({
                    template: '<div style="padding: 10px 10px 10px 10px;">'
                            +	'<div class="es-dialog-form-line">'
                            +  '<span style="color: #9d261d;">注意: 每个表单只能上传一个附件，重复上传会相互覆盖.且文件大小不能大于50MB</span>'
                            +  '</div>'
                            +  '<es-spinner ng-if="loading"></es-spinner>'
                            +	'<div class="es-dialog-form-line">'
                             +      '<a href="javascript:void(0)" class="button" ngf-select ng-model="file" name="file" ngf-max-size="50MB" ngf-min-height="100">选择文件</a>'
                             +      '<a ng-if="attachment" href="{{attachment}}" style="padding-left: 20px;">查看附件</a>'
                             +  '</div>'

                             +	'<div class="es-dialog-form-line">'
                             +      '<button type="submit" class="btn btn-primary" ng-click="submit()">上传</button>'
                             +  '</div>'
                             + '</div>',
                    plain: true,
                    controller: ['$scope', function ($dialogScope) {
                        $dialogScope.attachment = $scope.esForm.attachment;
                        $dialogScope.submit = function () {
                            if (!$dialogScope.file) {
                                EasyAssess.QuickMessage.error("请选择文件");
                            } else {
                                $dialogScope.loading = true;
                                $dialogScope.upload($dialogScope.file);
                            }
                        };

                        $dialogScope.upload = function (file) {
                            $dialogScope.fileInfo = file;
                            Upload.upload({
                                url: EasyAssess.activeEnv['assess']() + 'form/' + $scope.esForm.id + "/attachment",
                                data: {
                                    'attachment': file
                                },
                                withCredentials: true
                            }).success(function (data, status, headers, config) {
                                $scope.esForm.attachment = data.data;
                                $dialogScope.attachment = data.data;
                                EasyAssess.QuickMessage.message("上传成功");
                                $dialogScope.closeThisDialog();
                            }).error(function (data, status, headers, config) {
                                EasyAssess.QuickMessage.error("上传失败");
                            });
                        };
                    }]
                });
            };
            
            $scope.answer = {
                values:[],
                codes:[],
                details:[],
                signatures: {}
            };

            $scope.save = function(){
                if($scope.esType != 'plan'){
                    angular.forEach($scope.rawCodeList,function(rawCode){
                        delete rawCode['codeGuid']
                    });
                    $scope.answer.codes = $scope.rawCodeList;

                    var url = EasyAssess.activeEnv['assess']() + 'form/' + $scope.esForm.id;
                    $scope.esForm.status = "S";
                    $scope.esForm.values = $scope.answer.values;
                    $scope.esForm.codes = $scope.answer.codes;
                    $scope.esForm.details = $scope.answer.details;
                    $scope.esForm.signatures = $scope.answer.signatures;

                    esRequestService.esPut(url, $scope.esForm).then(function(res){
                        EasyAssess.QuickMessage.message("保存成功");
                    });
                }
            };

            $scope.submit = function(){
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


                        if($scope.esType == 'plan'){
                            $scope.$emit('submitted',{"values":$scope.answer.values,"codes":$scope.answer.codes, "details":$scope.answer.details, "signatures":$scope.answer.signatures});
                        }else{
                            var url = EasyAssess.activeEnv['assess']() + 'form/submit/' + $scope.esForm.id;
                            esRequestService.esPut(url, {"values":$scope.answer.values,"codes":$scope.answer.codes,"details":$scope.answer.details, "signatures":$scope.answer.signatures}).then(function(res){
                                $scope.$emit('submitted');
                            });
                        }
                    }
                );

            };

            $scope.rawCodeList = [];

            $scope.$on('$codeItemLookup_selected',function(e, data, attrs){
                var subjectGuid = attrs.subjectGuid;
                var codeGroupGuid = attrs.codeGroupGuid

                addCodeIntoList(e.targetScope, data, subjectGuid, codeGroupGuid);
            });

            $scope.$on('$tabSelected',function(e, ref, attrs){
                if (ref=="preView") {
                    $scope.previewModel = {
                        values:$scope.answer.values,
                        codes:$scope.rawCodeList,
                        details:$scope.answer.details,
                        signatures: $scope.answer.signatures
                    };
                } else {
                    $scope.previewModel = null;
                }
            });

            $scope.$on('removeSpecimen',function(e,data){
                removeFromList(data);
            });

            $scope.$on("$rowguidLookup_selected",function(e,data){
            });

            $scope.$on('valueChanged',function(e,data){
                updateTheValueList(data);
            });

            $scope.$on('batchNumberChanged',function(e,data){
                updateTheDetailList(data, 'batchNumber');
            });

            $scope.$on('expireChanged',function(e,data){
                updateTheDetailList(data, 'expire');
            });

            $scope.$on('signatureChanged',function(e, data){
                if (!$scope.answer.signatures[data.groupGuid]) {
                    $scope.answer.signatures[data.groupGuid] = {};
                }
                $scope.answer.signatures[data.groupGuid][data.field] = data.value;
            });

            function updateTheDetailList(data, field) {
                var exists = $scope.answer.details.find(function(detail){
                   return detail.subjectGuid == data.subjectGuid;
                });

                if (exists) {
                    exists[field] = data.value;
                } else {
                    var detail = {
                        'subjectGuid': data.subjectGuid
                    }
                    detail[field] = data.value;
                    $scope.answer.details.push(detail);
                }
            }

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
