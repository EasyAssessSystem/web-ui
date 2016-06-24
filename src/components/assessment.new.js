var EasyAssess = require('../easyassess.application');
EasyAssess.app.assessmentNewController = function($scope,ngDialog,esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.assessmentNewController.prototype = EasyAssess.extend({
    _initialize: function($scope,ngDialog,esReqeustService) {
        $scope.emptyModel = {"id": -1, "name": "", "template": "", "endDate": ""};
        $scope.templateFields = [
            {title: "模板", field: "name", type: "string", searchable: true, default: true}
        ];
        //$scope.startDate = null;
        //$scope.endedDate = null;
        $scope.hideStart = true;
        $scope.hideEnd = true;
        $scope.closeStartPop = function(){
            $scope.hideStart = true;

        };

        $scope.openStart = function() {
            $scope.hideStart = false;
        };

        $scope.openEnd = function(){
            $scope.hideEnd = false;
        };

        $scope.closeEndPop = function(){
            $scope.hideEnd = true
        };

        $scope.page1Show = true;
        $scope.page2Show = false;
        $scope.next = function(){
            $scope.page1Show = false;
            $scope.page2Show = true;
        };

        $scope.options = {};


        $scope.list = [
            {
                "id": 3,
                "name": "陕西CDC",
                "type": "C",
                "status": "A",
                "ministries": [
                    {
                        "id": 5,
                        "name": "西安CDC",
                        "type": "C",
                        "status": "A",
                        "ministries": [],
                        "supervisorId": 3,
                        "supervisorName": "陕西CDC"
                    },
                    {
                        "id": 6,
                        "name": "咸阳CDC",
                        "type": "C",
                        "status": "A",
                        "ministries": [],
                        "supervisorId": 3,
                        "supervisorName": "陕西CDC"
                    }
                ],
                "supervisorId": 1,
                "supervisorName": "中国CDC总局"
            },
            {
                "id": 4,
                "name": "江苏CDC",
                "type": "C",
                "status": "A",
                "ministries": [],
                "supervisorId": 1,
                "supervisorName": "中国CDC总局"
            }
        ]


    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessment_newController", EasyAssess.app.assessmentNewController);