var EasyAssess = require('../easyassess.application');
EasyAssess.app.MyAssessmentProgressController = function($scope) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.MyAssessmentProgressController .prototype = EasyAssess.extend({
    _initialize: function($scope) {
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("myassessment_progressController", EasyAssess.app.MyAssessmentProgressController);