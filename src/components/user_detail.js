var EasyAssess = require('../easyassess.application');
EasyAssess.app.UserDetailController = function($scope,ngDialog,esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.UserDetailController.prototype = EasyAssess.extend({
    _initialize: function($scope, ngDialog ,esRequestService) {
        $scope.readonly = true;
        $scope.validateFinalResult = true;
        $scope.activeModel = {};
        angular.extend($scope.activeModel, EasyAssess.session.currentUser);
        $scope.readonly = !EasyAssess.session.componentPermissionMap['health_ministry'].put;
        $scope.confirmedPassword = $scope.activeModel.password;
        $scope.updateProfile = function(){
            if ($scope.validateFinalResult) {
                esRequestService.esPut(EasyAssess.activeEnv.pdm() + 'user/profile', $scope.activeModel)
                  .then(function(){
                      return esRequestService.esPut(EasyAssess.activeEnv.pdm() + 'ministry/myministry',$scope.activeModel.ministries[0])
                  }).then(function(){
                      EasyAssess.QuickMessage.message("用户信息保存成功");
                      EasyAssess.session.currentUser = $scope.activeModel;
                  }).catch(function(err){
                    console.log(err);
                });
            }
        };

        $scope.validations = {
            name:{
                validateMethod: function(value){
                    var result = false;
                    if(typeof value=='string'&& value != 0){
                        result =  true;
                    }else {
                        result =  false;
                    }
                    return result;
                },
                validateResult:true,
                errorMessage:"姓名不能为空"
            },
            password:{
                validateMethod: function(value){
                    var result = false;
                    if(typeof value=='string'  && value.length >=6){
                        result =  true;
                    }else {
                        result =  false;
                    }
                    return result;
                },
                validateResult:true,
                errorMessage:"请输入有效密码(长度6到10位的字符)"
            },
            comfirmPassword:{
                validateMethod: function(value){
                    var result = false;
                    if(value === $scope.activeModel.password){
                        result =  true;
                    }else {
                        result =  false;
                    }
                    return result;
                },

                validateResult:true,
                errorMessage:"两次密码不一致"
            },
            ministryName:{
                validateMethod: function(value){
                    var result = false;
                    if(typeof value=='string'&& value != 0){
                        result =  true;
                    }else {
                        result =  false;
                    }
                    return result;
                },
                validateResult:true,
                errorMessage:"机构名称不能为空"
            }
        };


        $scope.$on('$es-validated-changed',function(){
            $scope.validateFinalResult = $scope.validations.name.validateResult
                && $scope.validations.password.validateResult
                && $scope.validations.comfirmPassword.validateResult
                && $scope.validations.ministryName.validateResult;
            $scope.$apply();
        });

    }
}, EasyAssess.app.MaintenanceController.prototype);


EasyAssess.app.registerController("userDetailController", EasyAssess.app.UserDetailController);