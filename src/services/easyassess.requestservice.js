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


            // if(url.indexOf('dashboard/1') > -1){
            //     rawData = {
            //         "result": "SUCC",
            //         "messages": [],
            //         "data": {
            //             "content": [
            //                 {
            //                     "id": 1,
            //                     "name": "卫生机构1",
            //                     "status": "U"
            //                 },{
            //                     "id": 2,
            //                     "name": "卫生机构2",
            //                     "status": "F"
            //                 },{
            //                     "id": 3,
            //                     "name": "卫生机构3",
            //                     "status": "A"
            //                 }
            //             ],
            //             "totalElements": 3,
            //             "totalPages": 1,
            //             "last": true,
            //             "size": 5,
            //             "number": 0,
            //             "sort": [
            //                 {
            //                     "direction": "ASC",
            //                     "property": "id",
            //                     "ignoreCase": false,
            //                     "nullHandling": "NATIVE",
            //                     "ascending": true
            //                 }
            //             ],
            //             "numberOfElements": 5,
            //             "first": true
            //         }
            //     };
            //     def.resolve(rawData)
            // }
            //
            // if(url.indexOf('dashboard/2')>-1){
            //     rawData = {
            //         "result": "SUCC",
            //         "messages": [],
            //         "data": {
            //             "content": [
            //                 {
            //                     "id": 1,
            //                     "name": "卫生机构1",
            //                     "status": "U"
            //                 },{
            //                     "id": 2,
            //                     "name": "卫生机构2",
            //                     "status": "F"
            //                 },{
            //                     "id": 3,
            //                     "name": "卫生机构3",
            //                     "status": "A"
            //                 },{
            //                     "id": 4,
            //                     "name": "卫生机构4",
            //                     "status": "U"
            //                 }
            //             ],
            //             "totalElements": 4,
            //             "totalPages": 1,
            //             "last": true,
            //             "size": 5,
            //             "number": 0,
            //             "sort": [
            //                 {
            //                     "direction": "ASC",
            //                     "property": "id",
            //                     "ignoreCase": false,
            //                     "nullHandling": "NATIVE",
            //                     "ascending": true
            //                 }
            //             ],
            //             "numberOfElements": 5,
            //             "first": true
            //         }
            //     };
            //     def.resolve(rawData)
            //
            // }
            // if (url.indexOf('dashboard') > -1){
            //     rawData = {
            //         "result": "SUCC",
            //         "messages": [],
            //         "data": {
            //             "content": [
            //                 {
            //                     "id": 1,
            //                     "name": "assessment1",
            //                     "libraries": 3,
            //                     "results":"1/3"
            //                 },{
            //                     "id": 2,
            //                     "name": "assessment2",
            //                     "libraries": 8,
            //                     "results":"4/8"
            //                 }
            //             ],
            //             "totalElements": 2,
            //             "totalPages": 1,
            //             "last": true,
            //             "size": 5,
            //             "number": 0,
            //             "sort": [
            //                 {
            //                     "direction": "ASC",
            //                     "property": "id",
            //                     "ignoreCase": false,
            //                     "nullHandling": "NATIVE",
            //                     "ascending": true
            //                 }
            //             ],
            //             "numberOfElements": 5,
            //             "first": true
            //         }
            //     };
            //     def.resolve(rawData);
            // }

            if(url.indexOf('template') > -1){
                rawData= {
                    "result": "SUCC",
                    "messages": [],
                    "data": {
                        "content": [
                            {
                                "id": 1,
                                "name": "测试模板101",
                                "status": "U"
                            }
                        ],
                        "totalElements":1,
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
                        "first": true,
                        "numberOfElements": 5
                    }
                };
                def.resolve(rawData)
            }
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