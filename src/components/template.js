var EasyAssess = require('../easyassess.application');

EasyAssess.app.TemplateController = function($scope, $timeout, ngDialog, esRequestService) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.TemplateController.prototype = EasyAssess.extend({
	initialize: function($scope) {
		$scope.groups = [];

		$scope.header = {
			name: null
		}

		$scope.addGroup = function() {
			$scope.groups.push({
				"guid": EasyAssess.utils.generateGUID(),
				"name": null,
				"specimens":[],
				"codes":[],
				"rows":[]
			});
		}

		$scope.removeGroup = function(guid) {
			for (var i=0;i<$scope.groups.length;i++) {
				if ($scope.groups[i].guid == guid) {
					$scope.groups.splice(i,1);
					break;
				}
			}
		}
	}
}, {});

EasyAssess.app.registerController("templateController", EasyAssess.app.TemplateController);
