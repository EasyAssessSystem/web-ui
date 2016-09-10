var EasyAssess = require('../easyassess.application');
EasyAssess.app.UserDetailController = function($scope,ngDialog,esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.UserDetailController.prototype = EasyAssess.extend({
    _initialize: function($scope) {

        //send the request to backend to get user detail
        esRequestService.esGet('url').then(function(data){
           $scope.activeModel = data;
        });

        $scope.validations = {
            username:{
                validateMethod: function(value){
                    var result = false;
                    if(typeof value=='string' && value.length >=3 && value.length <=8){
                        result =  true;
                    }else {
                        result =  false;
                    }
                    return result;
                },

                validateResult:true,
                errorMessage:"请输入有效用户名(长度3到8位的字符)"
            },
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
            }
        };


        $scope.$on('$es-validated-changed',function(){
            $scope.validateFinalResult = $scope.validations.name.validateResult
                && $scope.validations.username.validateResult
                && $scope.validations.password.validateResult
                && $scope.validations.comfirmPassword.validateResult;
            $scope.$apply();
        });

    },

    _select: function (model) {
    }
}, EasyAssess.app.MaintenanceController.prototype);


EasyAssess.app.registerController("userDetailController", EasyAssess.app.UserDetailController);