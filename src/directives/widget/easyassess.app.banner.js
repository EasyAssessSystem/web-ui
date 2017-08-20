var EasyAssess = require('../../easyassess.application');

EasyAssess.app.directive("esAppBanner", function($window, $http, $cookies,$state) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="es-app-banner">'
			     + 		'<div class="es-app-banner-title">'
			     +	 		'<img src="resource/logo_64.png" width="32" height="32" /><span style="padding-left: 5px;">第三方</span><span style="color:#00B312">质控平台</span>'
			     +		'</div>'
			     //+		'<div class="es-app-banner-subtitle" style="margin-left:35px;">第三方质控平台</div>'
			     +		'<div class="dropdown" uib-dropdown is-open="status.isopen" style="float:right;position:absolute;top:20px;right:50px;">'
			     +			'<button id="single-button" type="button" class="btn btn-success" uib-dropdown-toggle>登录用户<span class="caret"></span></button>'
			     + 				'<ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="split-button">'
		 		 +				'<li role="menuitem"><a href="#" ng-click="goToMyProfile()">用户信息</a></li>'
				 +				'<li role="menuitem" ng-click="logoff()"><a href="#">退出</a></li>'
				 +				'</ul>'
			     +		'</div>'
			     +	'</div>',
		scope: {
			
		},
		controller: ["$scope", function($scope, $element, $attrs){
			$scope.hideMenu = true;
			$scope.logoff = function () {
				$http.get(EasyAssess.activeEnv.pdm() + "user/session/logoff").success(function () {
					$cookies.remove("SESSION");
					$window.location.reload();
				});
			};

			$scope.goToMyProfile = function(){
				EasyAssess.TaskManager.start('user.detail',$state);
			};

			$scope.showMenu = function(){
				$scope.hideMenu = !$scope.hideMenu
			}
		}],
		link: function($scope) {
			
		}
	}
});
