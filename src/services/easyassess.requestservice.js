var EasyAssess = require('../easyassess.application');

EasyAssess.services['esRequestSerivce'] =
    EasyAssess.app.factory('esRequestService',function($http,$q){
       var service = {
           esGet:getRequest,
           esPut:putRequest,
           esPost:postRequest,
           esDelete:deleteRequest
       };

        function getRequest(url,paramsData){
            var def = $q.defer();
            // need to be deleted when done.
            $http.get(url,{params:paramsData, withCredentials: true})
                .success(function(data){
                    def.resolve(data);
                })
                .error(function(){
                    console.log('this is a http request error');
                });
            return def.promise;
        }

        function putRequest(url,data){
            var def = $q.defer();
            $http.put(url,data,{withCredentials: true})
                .success(function(data){
                    def.resolve(data);
                })
                .error(function(){
                    console.log('this is a http request error');
                });
            return def.promise;
        }

        function postRequest(url,data){
            var def = $q.defer();
            $http.post(url,data,{withCredentials: true})
                .success(function(data){
                    def.resolve(data);
                })
                .error(function(){
                    console.log('this is a http request error');
                });
            return def.promise;
        }

        function  deleteRequest(url,data){
            var def = $q.defer();
            $http.delete(url,data,{withCredentials: true})
                .success(function(data){
                    def.resolve(data);
                })
                .error(function(){
                    console.log('this is a http request error');
                });
            return def.promise;
        }

        return service;




    });