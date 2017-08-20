var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppMinistryBar"]
	= EasyAssess.app.directive("esAppMinistryBar", function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		template: '<div class="es-ministry-bar-wrapper">'
					 +	  '<div class="es-ministry-bar-el" ng-if="supervisorLogo"><img class="es-ministry-bar-logo" src="{{supervisorLogo}}"></div>'
			     + 		'<div ng-if="supervisor" class="es-ministry-bar-el">{{supervisor}}</div>'
					 + 		'<div ng-if="supervisor" class="es-ministry-bar-el">/</div>'
					 + 		'<div class="es-ministry-bar-el" ng-if="currentMinistry.logo"><img class="es-ministry-bar-logo" src="{{currentMinistry.logo}}"></div>'
					 + 		'<div class="es-ministry-bar-el">{{currentMinistry.name}}</div>'
			     + '</div>',
		scope: {
			
		},
		controller: ["$scope", function($scope, $element, $attrs){
			if (EasyAssess.session.currentUser.ministries && EasyAssess.session.currentUser.ministries.length > 0) {
				$scope.currentMinistry = EasyAssess.session.currentUser.ministries[0];
				if (EasyAssess.session.currentUser.ministries[0].supervisorName) {
					$scope.supervisor = EasyAssess.session.currentUser.ministries[0].supervisorName;
					$scope.supervisorLogo = EasyAssess.session.currentUser.ministries[0].supervisorLogo;
				}
			}
		}],
		link: function($scope) {
			
		}
	}
});
