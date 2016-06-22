var EasyAssess = require('../easyassess.application');
EasyAssess.app.assessmentNewController = function($scope,ngDialog,esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.assessmentNewController.prototype = EasyAssess.extend({
    _initialize: function($scope) {
        $scope.emptyModel = {"id":-1,"name":""}
        }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessment_newController", EasyAssess.app.assessmentNewController);