var EasyAssess = require('../easyassess.application');
EasyAssess.app.MyAssessmentDoneController = function($scope) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.MyAssessmentDoneController .prototype = EasyAssess.extend({
    _initialize: function($scope) {
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("myassessment_doneController", EasyAssess.app.MyAssessmentDoneController);