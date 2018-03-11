var EasyAssess = require('../easyassess.application');
EasyAssess.app.NoticesController = function($scope,ngDialog,esRequestService) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.NoticesController.prototype = EasyAssess.extend({
	_initialize: function($scope) {
		$scope.fields = [
			{title: EasyAssess.lang.forms.notice.titleText, field:"subject", type:"string",searchable:false,default:true},
			{title: EasyAssess.lang.forms.notice.authorText, field:"authorName", type:"string",searchable:false,default:false},
			{title: EasyAssess.lang.forms.notice.dateText, field:"articleDate", type:"string",searchable:false,default:false}
		];

		$scope.back = function () {
			$scope.activeModel = null;
		}
	},

	_postSelect: function (model) {
		console.log(model);
	}
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("noticesController", EasyAssess.app.NoticesController);