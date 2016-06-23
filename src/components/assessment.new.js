var EasyAssess = require('../easyassess.application');
EasyAssess.app.assessmentNewController = function($scope,ngDialog,esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.assessmentNewController.prototype = EasyAssess.extend({
    _initialize: function($scope) {
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
        }

        $scope.closeEndPop = function(){
            $scope.hideEnd = true
        }




    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessment_newController", EasyAssess.app.assessmentNewController);