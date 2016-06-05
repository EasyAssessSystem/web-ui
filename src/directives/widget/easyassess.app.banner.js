var EasyAssess = require('../../easyassess.application');

EasyAssess.app.directive("esAppBanner", function($window, $http) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="es-app-banner">'
			     + 		'<div class="es-app-banner-title">'
			     +	 		'<img src="logo_64.png" width="32" height="32" /><span style="padding-left: 5px;">Easy</span><span style="color:#00B312">Assess</span>'
			     +		'</div>'
			     +		'<div class="es-app-banner-subtitle" style="margin-left:35px;">EQA AND IQC Tracking System</div>'
			     +		'<div style="float:right;position:absolute;top:20px;right:30px;">'
			     +			'<button class="btn btn-success" style="width:90px;background-color:#00b312">'
			     +				'<span class="glyphicon glyphicon-log-out"></span>'
			     +				'<span class="es-icon-button-text" ng-click="logoff()">登出</span>'
			     +			'</button>'
			     +		'</div>'
			     +	'</div>',
		scope: {
			
		},
		controller: ["$scope", function($scope, $element, $attrs){
			$scope.logoff = function () {
				$http.get(EasyAssess.activeEnv.pdm() + "user/session/logoff").success(function () {
					$window.location.reload();
				});
			}
		}],
		link: function($scope) {
			
		}
	}
});
