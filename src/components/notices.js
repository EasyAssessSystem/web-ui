var EasyAssess = require('../easyassess.application');
EasyAssess.app.NoticesController = function($scope,ngDialog,esRequestService) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.NoticesController.prototype = EasyAssess.extend({
	_initialize: function($scope) {
		$scope.fields = [];
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("noticesController", EasyAssess.app.NoticesController);