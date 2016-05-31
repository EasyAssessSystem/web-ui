var angular = require('angular');
var router = require('angular-ui-router');
require('./components/user.html');
require('./components/cdc.html');
require('./components/role.html');
/**
 * Created by alexli on 2016/4/3.
 * Edited by aaronchen on 2016/5/14
 */
var EasyAssess = {
    version: '1.0.0',
    copyright:'Stardust',
    author: 'Cheng,Li',
    description: 'EasyAssess Application Namespace',
}

EasyAssess.session = {};

EasyAssess.environments = {
	'dev': {
		pdm: function(domain) {
			return 'http://localhost:8180/' + (domain ? domain : EasyAssess.session.domain) + '/data/'
		}
	},
	'prod':{

	},
	'test':{

	}
}

EasyAssess.activeEnv = EasyAssess.environments.dev;

/**
 * Define application
 */
EasyAssess.app = angular.module("EasyAssessApp",[require('angular-ui-router'),require('angular-sanitize'),require('ng-dialog'),require('angular-ui-bootstrap/src/dropdown')
],function($controllerProvider){
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

EasyAssess.extend = function (destination, source) {
	for (property in source) {
		if (property.toString().indexOf("super_") != -1) continue;
		if (destination[property] != null) {
			destination["super_" + property] = source[property];
			continue;
		} else {
			destination[property] = source[property];
		}
	}
	return destination;
}


EasyAssess.app.MaintenanceController = Class.create();

EasyAssess.app.MaintenanceController.prototype = {
	initialize: function () {
		if (this._initialize) {
			this._initialize.apply(this, arguments);
		}

		var caller = arguments.callee.caller;

		var params = caller.toString()
			.replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
			.match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
			.split(/,/)

		for (var i=0;i<params.length;i++) {
			this[params[i]] = arguments[i];
		}

		this.__default.apply(this, arguments);
	},

	_select: function(model) {
		this.$scope.activeModel = model;
	},

	_cancel: function() {
		this.$scope.activeModel = null;
	},

	_add:function(){

	},

	_save: function () {
		var $http = this.$http;
		var $scope = this.$scope;
		if (this.$scope.activeModel.id > 0) {
			$http.put(EasyAssess.activeEnv.pdm() + $scope.resource + '/' + $scope.activeModel.id, $scope.activeModel).success((function(response){
				if (this._postSave) {
					this._postSave(response.data)
				}
				$scope.activeModel = null;
			}).bind(this));
		} else {
			$http.post(EasyAssess.activeEnv.pdm() + $scope.resource, $scope.activeModel).success((function(response){
				if (this._postSave) {
					this._postSave(response.data)
				}
				$scope.activeModel = null;
			}).bind(this));
		}
	},

	_delete: function() {
		this.ngDialog.openConfirm({
			template:   '<div class="ngdialog-message">删除操作无法恢复,是否确定要删除?</div>'
			+ '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
			plain: true
		}).then(
			(function(value){
				if (this.$scope.activeModel.id > 0) {
					this.$http.delete(EasyAssess.activeEnv.pdm() + this.$scope.resource + '/' + this.$scope.activeModel.id, this.$scope.activeModel).success((function(){
						this.$scope.activeModel = null;
					}).bind(this));
				}
			}).bind(this),
			function(reason){
			}
		);
	},

	_postSelect: function(model) {
		$('.es-maint-button-group button[ng-click="delete()"]').show();
	},

	_postAdd: function() {
		$('.es-maint-button-group button[ng-click="delete()"]').hide();
	},

    __default: function($scope, $http, ngDialog) {

    	$scope.$on('$selected', (function(e, model){
    		this._select(model);
			if(this._postSelect) {
				this._postSelect(model);
			}
        }).bind(this));

    	$scope.$on('$cancel', (function(e){
    		this._cancel();
        }).bind(this));

		$scope.$on('$delete', (function(e){
			this._delete();
		}).bind(this));
    	
    	$scope.$on('$save', (function(e){
			this._save();
        }).bind(this));

		$scope.$on('$added', (function(e){
			this._add();
			if(this._postAdd) {
				this._postAdd();
			}
		}).bind(this));

    	if (this._default) {
    		this._default.apply(this, arguments);
    	}
    }
}

module.exports = EasyAssess;
