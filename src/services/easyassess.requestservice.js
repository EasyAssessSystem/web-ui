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
            // templairy code for dashboard
            if (url.indexOf('dashboard') > -1){
                rawData = {
                    "result": "SUCC",
                    "messages": [],
                    "data": {
                        "content": [
                            {
                                "id": 1,
                                "name": "assessment1",
                                "libraries": 20,
                                "results": "6/16"
                            },{
                                "id": 2,
                                "name": "assessment2",
                                "libraries": 45,
                                "results": "10/16"
                            },{
                                "id": 3,
                                "name": "assessment3",
                                "libraries": 58,
                                "results": "9/16"
                            },{
                                "id": 4,
                                "name": "assessment4",
                                "libraries": 90,
                                "results": "10/16"
                            },{
                                "id": 5,
                                "name": "assessment5",
                                "libraries": 108,
                                "results": "15/16"
                            }
                        ],
                        "totalElements": 5,
                        "totalPages": 1,
                        "last": true,
                        "size": 5,
                        "number": 0,
                        "sort": [
                            {
                                "direction": "ASC",
                                "property": "id",
                                "ignoreCase": false,
                                "nullHandling": "NATIVE",
                                "ascending": true
                            }
                        ],
                        "numberOfElements": 5,
                        "first": true
                    }
                };
                def.resolve(rawData);
            }
            // need to be deleted when done.
            $http.get(url,{params:paramsData})
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
            $http.put(url,data)
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
            $http.post(url,data)
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
            $http.delete(url,data)
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