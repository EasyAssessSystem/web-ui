var EasyAssess = require('../../easyassess.application');

EasyAssess.app.directive("esAppBanner", function($window, $http, $cookies,$state) {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="es-app-banner">'
			     + 		'<div class="es-app-banner-title">'
			     +	 		'<img src="resource/logo_64.png" width="32" height="32" /><span style="padding-left: 5px;">' + EasyAssess.lang.widgets.banner.thirdText +'</span><span style="color:#00B312">' + EasyAssess.lang.widgets.banner.qcSystemText + '</span>'
			     +		'</div>'
			     //+		'<div class="es-app-banner-subtitle" style="margin-left:35px;">第三方质控平台</div>'
			     +		'<div class="dropdown" uib-dropdown is-open="status.isopen" style="float:right;position:absolute;top:20px;right:50px;">'
			     +			'<button id="single-button" type="button" class="btn btn-success" uib-dropdown-toggle>' + EasyAssess.lang.widgets.banner.currentUserText + '<span class="caret"></span></button>'
			     + 				'<ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="split-button">'
		 		 +				'<li role="menuitem"><a href="#" ng-click="goToMyProfile()">' + EasyAssess.lang.widgets.banner.userProfileText + '</a></li>'
				 +				'<li role="menuitem" ng-click="logoff()"><a href="#">' + EasyAssess.lang.widgets.banner.logOffText + '</a></li>'
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
