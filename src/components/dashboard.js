var EasyAssess = require('../easyassess.application');
EasyAssess.app.DashboardController = function($scope,esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.DashboardController.prototype = EasyAssess.extend({
    _initialize: function($scope) {
        $scope.fields = [
            {title:"Assessments", field:"name", type:"string",searchable:true,default:true},
            {title:"libraries", field:"libraries", type:"string",searchable:false,default:false},
            {title:"Results", field:"results", type:"string",searchable:false,default:false}
        ];
        $scope.data = [300, 500, 100];
        $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];

        $scope.data2 = [400, 600, 200];
        $scope.labels2 = ["Download Sales2", "In-Store Sales2", "Mail-Order Sales2"];

        $scope.linelabels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.lineseries = ['Series A', 'Series B'];
        $scope.linedata = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
    },
    _restrict: function() {
    }


}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("dashboardController", EasyAssess.app.DashboardController);