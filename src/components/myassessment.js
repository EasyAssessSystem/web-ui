var EasyAssess = require('../easyassess.application');
EasyAssess.app.MyAssessmentController = function($scope) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.MyAssessmentController .prototype = EasyAssess.extend({
    _initialize: function($scope) {
    },
    _restrict: function() {
    },
    _filterOptions:function(){
        
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("myassessmentController", EasyAssess.app.MyAssessmentController);