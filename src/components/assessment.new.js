var EasyAssess = require('../easyassess.application');
EasyAssess.app.assessmentNewController = function($scope,ngDialog,esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.assessmentNewController.prototype = EasyAssess.extend({
    _initialize: function($scope) {
        $scope.emptyModel = {"id": -1, "name": "", "template": "", "endDate": ""};
        $scope.templateFields = [
            {title: "模板", field: "name", type: "string", searchable: true, default: true}
        ]
        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt = null;
        };

        //$scope.inlineOptions = {
        //    customClass: getDayClass,
        //    minDate: new Date(),
        //    showWeeks: true
        //};

        $scope.dateOptions = {
            dateDisabled: true,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessment_newController", EasyAssess.app.assessmentNewController);