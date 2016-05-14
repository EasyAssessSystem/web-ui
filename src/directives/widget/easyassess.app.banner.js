var EasyAssess = require('../../easyassess.application');

EasyAssess.app.directive("esAppBanner", function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template: '<div class="es-app-banner">'
			     + 		'<div class="es-app-banner-title">'
			     +	 		'<span class="glyphicon glyphicon-fire" style="color:#00B312;padding-right:10px;"></span><span>Easy</span><span style="color:#00B312">Assess</span>'
			     +		'</div>'
			     +		'<div class="es-app-banner-subtitle" style="margin-left:35px;">EQA AND IQC Tracking System</div>'
			     +		'<div style="float:right;position:absolute;top:20px;right:30px;">'
			     +			'<button class="btn btn-success" style="width:90px;background-color:#00b312">'
			     +				'<span class="glyphicon glyphicon-log-out"></span>'
			     +				'<span class="es-icon-button-text">登出</span>'
			     +			'</button>'
			     +		'</div>'
			     +	'</div>',
		scope: {
			
		},
		controller: ["$scope", function($scope, $element, $attrs){
			
		}],
		link: function($scope) {
			
		}
	}
});
