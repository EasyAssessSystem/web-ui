var EasyAssess = require('../easyassess.application');

EasyAssess.app.IQCTemplateController = function($scope, $timeout, ngDialog, esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCTemplateController.prototype = EasyAssess.extend({
    initialize: function($scope, $timeout, ngDialog, esRequestService) {

        console.log('this is the iqc controller');

        $scope.groups = [];


        $scope.header = {
            name: null
        };

        $scope.lookupFields = [
            {title:"名称", field:"header.name", type:"string",searchable:true,default:true},
        ];

        $scope.addGroup = function() {
            console.log('this is a new iqc group');
            $scope.groups.push({
                "guid": EasyAssess.utils.generateGUID(),
                "name": null,
                "specimens":[],
                "codeGroups":[],
                "rows":[]
            });
        }

        $scope.removeGroup = function(guid) {
            for (var i=0;i<$scope.groups.length;i++) {
                if ($scope.groups[i].guid == guid) {
                    $scope.groups.splice(i,1);
                    break;
                }
            }
        };

        $scope.save = function() {
            esRequestService.esPost(EasyAssess.activeEnv.iqc() + "template",
                angular.toJson({
                    "id": $scope.activeModel ? $scope.id : null,
                    "guid": $scope.activeModel? $scope.activeModel.guid:EasyAssess.utils.generateGUID(),
                    "header": $scope.header,
                    "groups": $scope.groups
                })).then(
                function(response) {
                    EasyAssess.QuickMessage.message("保存成功");
                    $scope.activeModel = response.data;
                }
            );
        };

        $scope.remove = function() {
            ngDialog.openConfirm({
                template:   '<div class="ngdialog-message">删除操作无法恢复,是否确定要删除?</div>'
                + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
                plain: true
            }).then(
                (function(value){
                    esRequestService.esDelete(EasyAssess.activeEnv.iqc() + "template/" + $scope.activeModel.id).then(function(){
                        EasyAssess.QuickMessage.message("删除成功");
                        $scope.new();
                    });
                }).bind(this),
                function(reason){
                }
            );
        }

        $scope.$on('$templateLookup_selected', function(e, model){
            $scope.activeModel = model;
            $timeout(function(){
                $scope.$apply(function () {
                    for (var key in model) {
                        $scope[key] = model[key];
                    }
                });
            },100)
        });

        $scope.new = function() {
            $timeout(function(){
                $scope.$apply(function () {
                    $scope.activeModel = null;
                    $scope.header = {name:null};
                    $scope.groups = [];
                });
            },100)
        }

        $scope.copy = function() {
            $scope.header = {name:$scope.header.name + " - " + "Copy"};
            $scope.activeModel = null;
            $scope.save();
        }
    }
}, {});

EasyAssess.app.registerController("iqc_templateController", EasyAssess.app.IQCTemplateController);
