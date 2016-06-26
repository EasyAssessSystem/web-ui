var EasyAssess = require('../easyassess.application');
EasyAssess.app.assessmentNewController = function($scope,$element,ngDialog,esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.assessmentNewController.prototype = EasyAssess.extend({
    _initialize: function($scope,$element,ngDialog,esReqeustService) {
        $scope.emptyModel = {"id": -1, "name": "", "templateGuid": "", "startDate": "","endDate":"","owner":"","participants":{},"specimenCodes":{}};
        $scope.templateFields = [
            {title: "模板", field: "name", type: "string", searchable: true, default: true}
        ];
        //$scope.emptyModel.startDate = null;
        //$scope.emptyModel.endDate = null;
        $scope.hideStart = true;
        $scope.hideEnd = true;
        $scope.closeStartPop = function(){
            $scope.hideStart = true;
            console.log($scope.emptyModel, typeof ($scope.emptyModel));
        };

        $scope.openStart = function() {
            $scope.hideStart = false;
        };

        $scope.openEnd = function(){
            $scope.hideEnd = false;
        };

        $scope.closeEndPop = function(){
            $scope.hideEnd = true;
            console.log($scope.emptyModel, typeof ($scope.emptyModel));

        };

        $scope.formatDate = function (date) {
            function pad(n) {
                return n < 10 ? '0' + n : n;
            }

            return date && date.getFullYear()
                + '-' + pad(date.getMonth() + 1)
                + '-' + pad(date.getDate());
        };


        $scope.page1Show = true;
        $scope.page2Show = false;
        $scope.next = function(){
            $scope.page1Show = false;
            $scope.page2Show = true;
        };


        $scope.chooseItem = function(item){
            _updateChild(item);
            $scope.emptyModel.participants = {};
            _updateEmptyModel($scope.list);
        };


        function _updateChild(item){
            if(item.ministries.length >0){
                var newState = item.selected;
                angular.forEach(item.ministries,function(eachMinistry){
                    eachMinistry.selected = newState;
                    _updateChild(eachMinistry);
                })

            }
        }

        function _updateParent(item){
            if(item.supervisorId >0){
                var parentMinistry = _searchParent(item.supervisorId,$scope.list);
                var parentState = false;
                angular.forEach(parentMinistry.ministries,function(eachMinistry){
                    parentState = eachMinistry || parentMinistry;
                });
                parentMinistry.selected = parentState;
                _updateParent(parentMinistry);
            }

        }


        function _searchParent(id,nodes){
            var parent;
            angular.forEach(nodes,function(each){
                if(!parent){
                    if(each.id == id){
                        return parent = each;
                    }else{
                       parent =  _searchParent(id,each.ministries)
                    }
                }else{
                }
            });
            return parent;
        }

        function _updateEmptyModel(nodes){
            angular.forEach(nodes,function(node){
                if(node.selected){
                    $scope.emptyModel.participants[node.id] = node.name;
                }else{

                }
                if(node.ministries.length >0){
                    _updateEmptyModel(node.ministries)
                }
            })
        }


        esReqeustService.esGet(EasyAssess.activeEnv['pdm']() + 'ministry' + "/list", {
            size: 1000,
            page: 0
        }).then(function (result) {
            $scope.list = result.data.content
        });


        //$scope.list = [
        //    {
        //        "id": 3,
        //        "name": "陕西CDC",
        //        "type": "C",
        //        "status": "A",
        //        "ministries": [
        //            {
        //                "id": 5,
        //                "name": "西安CDC",
        //                "type": "C",
        //                "status": "A",
        //                "ministries": [{
        //                    "id": 11,
        //                    "name": "未央CDC",
        //                    "type": "C",
        //                    "status": "A",
        //                    "ministries": [],
        //                    "selected":false,
        //                    "supervisorId": 5,
        //                    "supervisorName": "西安CDC"
        //                },{
        //                    "id": 12,
        //                    "name": "碑林CDC",
        //                    "type": "C",
        //                    "status": "A",
        //                    "ministries": [],
        //                    "selected":false,
        //                    "supervisorId": 5,
        //                    "supervisorName": "西安CDC"
        //                }],
        //                "selected":false,
        //                "supervisorId": 3,
        //                "supervisorName": "陕西CDC"
        //            },
        //            {
        //                "id": 6,
        //                "name": "咸阳CDC",
        //                "type": "C",
        //                "status": "A",
        //                "ministries": [],
        //                "selected":false,
        //                "supervisorId": 3,
        //                "supervisorName": "陕西CDC"
        //            }
        //        ],
        //        "selected":false,
        //        "supervisorId": -1,
        //        "supervisorName": "中国CDC总局"
        //    },
        //    {
        //        "id": 4,
        //        "name": "江苏CDC",
        //        "type": "C",
        //        "status": "A",
        //        "ministries": [],
        //        "selected":false,
        //        "supervisorId": -1,
        //        "supervisorName": "中国CDC总局"
        //    }
        //]


    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessment_newController", EasyAssess.app.assessmentNewController);