var EasyAssess = require('../easyassess.application');

EasyAssess.services['esRequestSerivce'] =
    EasyAssess.app.factory('esRequestService', function ($http, $q, $window, $cookies ,ngDialog) {
        function invalidSession() {
            ngDialog.open({
                template: '<div class="es-dialog-content"><div align="center" class="es-dialog-form-line">无效的Session,请重新登录</div><div class="es-dialog-form-line" align="center"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
                plain: true,
                controller: ['$scope', function ($digExepectedValue) {
                    $digExepectedValue.submit = function () {
                        $digExepectedValue.closeThisDialog();
                        $cookies.remove("SESSION");
                        $window.location.reload();
                    }
                }]
            });
        }

        function errorMessage(messages) {
            if (messages[0].message.indexOf("Error:") == 0) {
                EasyAssess.QuickMessage.error("系统发生错误,请尝试重新操作或联系系统管理员");
            } else {
                EasyAssess.QuickMessage.error(messages[0].message);
            }
        }

        var service = {
            esGet: getRequest,
            esPut: putRequest,
            esPost: postRequest,
            esDelete: deleteRequest
        };

        function getRequest(url, paramsData) {
            var def = $q.defer();
            // need to be deleted when done.
            $http.get(url, {params: paramsData, withCredentials: true})
                .success(function (data) {
                    if (data.result == "FAILED") {
                        if (data.messages[0].message == "503") {
                            invalidSession();
                        } else {
                            errorMessage(data.messages);
                        }
                    } else {
                        def.resolve(data);
                    }
                })
                .error(function () {
                    console.log('this is a http request error');
                });
            return def.promise;
        }

        function putRequest(url, data) {
            var def = $q.defer();
            $http.put(url, data, {withCredentials: true})
                .success(function (data) {
                    if (data.result == "FAILED") {
                        if (data.messages[0].message == "503") {
                            invalidSession();
                        } else {
                            errorMessage(data.messages);
                        }
                    } else {
                        def.resolve(data);
                    }
                })
                .error(function () {
                    console.log('this is a http request error');
                });
            return def.promise;
        }

        function postRequest(url, data) {
            var def = $q.defer();
            $http.post(url, data, {withCredentials: true})
                .success(function (data) {
                    if (data.result == "FAILED") {
                        if (data.messages[0].message == "503") {
                            invalidSession();
                        } else {
                            errorMessage(data.messages);
                        }
                    } else {
                        def.resolve(data);
                    }
                })
                .error(function () {
                    console.log('this is a http request error');
                });
            return def.promise;
        }

        function deleteRequest(url) {
            var def = $q.defer();
            $http.delete(url, {withCredentials: true})
                .success(function (data) {
                    if (data.result == "FAILED") {
                        if (data.messages[0].message == "503") {
                            invalidSession();
                        } else {
                            errorMessage(data.messages);
                        }
                    } else {
                        def.resolve(data);
                    }
                })
                .error(function () {
                    console.log('this is a http request error');
                });
            return def.promise;
        }

        return service;
    });