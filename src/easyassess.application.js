var angular = require('angular');
var router = require('angular-ui-router');
require('./components/user.html');
require('./components/cdc.html');
/**
 * Created by alexli on 2016/4/3.
 * Edited by aaronchen on 2016/5/14
 */
var EasyAssess = {
    version: '1.0.0',
    copyright:'Stardust',
    author: 'Cheng,Li',
    description: 'EasyAssess Application Namespace'
}

 EasyAssess.env = {
	dev:'http://localhost:8180/pdm/data/',
	prod:'',
	test:''
}


/**
 * Define application
 */
EasyAssess.app = angular.module("EasyAssessApp",[require('angular-ui-router'),require('angular-sanitize'),require('ng-dialog')],function($controllerProvider){
	EasyAssess.app.controllerProvider = $controllerProvider;
});

EasyAssess.formApp = angular.module("EasyAssessForm",
		[require('angular-sanitize'), require('ng-dialog')],function(){
	
});

/**
 * Application config
 */
EasyAssess.app.config(
	function($stateProvider, $urlRouterProvider,$httpProvider) {
	  EasyAssess.app.stateProvider = $stateProvider;
	  EasyAssess.app.urlRouterProvider = $urlRouterProvider;
	  $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}
);


EasyAssess.app.registerController = function(index, controller) {
	this.controllerProvider.register(index, controller);
}

/**
 * Define directive hash
 */
EasyAssess.directives = {};
EasyAssess.builders = {
	_widgets: {},
	
	register: function(widgetName, providerName, provider) {
		if (!EasyAssess.providers._widgets[widget]) {
			EasyAssess.providers._widgets[widget] = {};
		} 
		EasyAssess.providers._widgets[widget][providerName] = provider;
	},
	
	get: function(widgetName, providerName) {
		if (EasyAssess.providers._widgets[widget]) {
			return EasyAssess.providers._widgets[widget][providerName];
		}
		return null;
	}
}
/**
 * Loading spinner
 */
EasyAssess.directives["esSpinner"] 
	= EasyAssess.app.directive("esSpinner", function() {
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:  '<div id="fountainG">'
					+	'<div id="fountainG_1" class="fountainG"></div>'
					+	'<div id="fountainG_2" class="fountainG"></div>'
					+	'<div id="fountainG_3" class="fountainG"></div>'
					+	'<div id="fountainG_4" class="fountainG"></div>'
					+	'<div id="fountainG_5" class="fountainG"></div>'
					+	'<div id="fountainG_6" class="fountainG"></div>'
					+	'<div id="fountainG_7" class="fountainG"></div>'
					+	'<div id="fountainG_8" class="fountainG"></div>'
					+'</div>',
		scope: {
			
		},
		controller: ["$scope", function($scope, $element, $attrs){
		}],
		link: function($scope) {
			
		}
	}
});

EasyAssess.codeGroups = [
  {"value":"method","text":"方法"},
  {"value":"instrument","text":"仪器"},
  {"value":"agentia","text":"试剂"},
  {"value":"calibrator","text":"校准物"}
];

EasyAssess.units = [
  {"value":"mEq/L"},
  {"value":"μmol/L"}
];

EasyAssess.utils = {
	generateGUID: function (){
		function S4() {
	       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	    }
	    return (S4()+S4()+"-"+S4()+S4()+"-"+S4()+S4()+S4());
	}
};

EasyAssess.session = {};

EasyAssess.TaskManager = {
	_cached: {},
	
	_loadController:function(module){
		require("./components/" + module);
	},

	start: function(module, state) {
		if (!this._cached[module]) {
			this._loadController(module);
			var options = {
					url: "/" + module,
				    templateUrl: module + '.html',
				    controller: module + "Controller"
				}
				
				EasyAssess.app.stateProvider.state(module, options);
				
				state.go(module, {});
				
				EasyAssess.TaskManager._cached[module] = true;

		} else {
			state.go(module, {});
		}
	},
	
	terminate: function() {
		
	}
};

var $A = Array.from = function (iterable) {
    if (!iterable) return [];
    if (iterable.toArray) {
        return iterable.toArray();
    } else {
        var results = [];
        for (var i = 0; i < iterable.length; i++)
            results.push(iterable[i]);
        return results;
    }
}

var Class = {
    create: function () {
        return function () {
            this.initialize.apply(this, arguments);
        }
    }
}


EasyAssess.app.MaintenanceController = Class.create();

EasyAssess.app.MaintenanceController.prototype = {
	initialize: function () {
		if (this._initialize) {
			this._initialize.apply(this, arguments);
		}
		this.__default.apply(this, arguments);
	},
    
    __default: function($scope, $http) {

    	$scope.$on('$selected', function(e, model){
    		$scope.activeModel = model;
        });
    	
    	$scope.$on('$cancel', function(e){
    		$scope.activeModel = null;
        });
    	
    	$scope.$on('$save', function(e){
    		if ($scope.activeModel.id > 0) {
    			$http.put('../../dashboard/pdm/' + $scope.resource + '/' + $scope.activeModel.id, $scope.activeModel).success(function(){
    				$scope.activeModel = null;
                });
    		} else {
    			$http.post('../../dashboard/pdm/' + $scope.resource, $scope.activeModel).success(function(){
    				$scope.activeModel = null;
                });
    		}
        });
    	
    	if (this._default) {
    		this._default.apply(this, arguments);
    	}
    }
}

module.exports = EasyAssess;
