var angular = require('angular');
var router = require('angular-ui-router');
require('./components/user.html');
require('./components/cdc.html');
require('./components/role.html');
require('./components/health_ministry.html');
require('./components/assay_category.html');
require('./components/code_group.html');
require('./components/assay_code.html');
require('./components/template.html');

/**
 * Created by alexli on 2016/4/3.
 * Edited by aaronchen on 2016/5/14
 */
var EasyAssess = {
    version: '1.0.0',
    copyright:'Stardust',
    author: 'Li, Cheng;Cheng, Dong',
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
EasyAssess.app = angular.module("EasyAssessApp",[require('angular-ui-router'),require('angular-animate'),require('angular-sanitize'),require('ng-dialog'),require('angular-ui-bootstrap/src/dropdown'),require('angular-ui-tree')
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
EasyAssess.services={};
EasyAssess.builders = {
	_widgets: {},
	
	register: function(widgetName, providerName, provider) {
		if (!this._widgets[widgetName]) {
			this._widgets[widgetName] = {};
		} 
		this._widgets[widgetName][providerName] = provider;
	},

	get: function(widgetName, providerName) {
		if (EasyAssess.builders._widgets[widgetName]) {
			return EasyAssess.builders._widgets[widgetName][providerName];
		}
		return null;
	}
};


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

		this.module = module;
	},
	
	terminate: function() {
		
	},

	current: function() {
		return this.module;
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

		var caller = arguments.callee.caller;

		var params = caller.toString()
			.replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
			.match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
			.split(/,/)

		for (var i=0;i<params.length;i++) {
			this[params[i]] = arguments[i];
		}

		if (this._initialize) {
			this._initialize.apply(this, arguments);
		}

		this.__default.apply(this, arguments);

		this._permission = EasyAssess.session.componentPermissionMap[EasyAssess.TaskManager.current()];

		this._postInitialize();
	},

	_postInitialize: function() {
		this._restrict();
		this._filterOptions();
	},

	_filterOptions: function() {
		this.$scope.options = this.$scope.fields.filter(function(eachfield){
			return eachfield.searchable;
		}).map(function(item){
			var option = {text:"",value:"",default:false};
			option.text = item.title;
			option.value = item.cascadeField ? item.cascadeField : item.field;
			option.default = item.default;
			return option;
		});
	},

	_restrict: function() {
		if (!this._permission.post) {
			$("div[ng-click='addNew()']").hide();
		}
		if (!this._permission.delete) {
			$('.es-maint-button-group button[ng-click="delete()"]').hide();
		}
		if (!this._permission.put) {
			$('.es-maint-button-group button[ng-click="save()"]').hide();
			this.$scope.readonly = true;
		}
	},

	_select: function(model) {
		this.$scope.activeModel = model;
	},

	_cancel: function() {
		this.$scope.activeModel = null;
	},

	_add:function(){
		this.$scope.activeModel = EasyAssess.extend({},this.$scope.emptyModel);
	},

	_save: function () {
		var $http = this.$http;
		var $scope = this.$scope;
		if (this.$scope.activeModel.id > 0) {
			this.esRequestService.esPut(EasyAssess.activeEnv.pdm() + $scope.resource + '/' + $scope.activeModel.id,$scope.activeModel)
				.then((function(result){
					if (this._postSave) {
						this._postSave(result.data)
					}
					$scope.activeModel = null;
				}).bind(this));
		} else {
			this.esRequestService.esPost(EasyAssess.activeEnv.pdm() + $scope.resource,$scope.activeModel)
				.then((function(result){
					if (this._postSave) {
						this._postSave(result.data)
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
					this.esRequestService.esDelete(EasyAssess.activeEnv.pdm() + this.$scope.resource + '/' + this.$scope.activeModel.id,this.$scope.activeModel.activeModel)
						.then((function(){
							this.$scope.activeModel = null;
						}).bind(this));
				}
			}).bind(this),
			function(reason){
			}
		);
	},

	_postSelect: function(model) {
		if (this._permission.delete) {
			$('.es-maint-button-group button[ng-click="delete()"]').show();
		}
	},

	_postAdd: function() {
		$('.es-maint-button-group button[ng-click="delete()"]').hide();
	},

    __default: function($scope,ngDialog,esRequestService) {

		$scope.normalStatus = [
			{text: "无效", value: "U"},
			{text: "有效", value: "A"}
		];

		$scope.$watch('activeModel',function(newValue, oldValue, scope){
			if (newValue == null) {
				$scope.$broadcast('$refresh');
			}
		});

    	$scope.$on('$selected', (function(e, model){
			if (this._preSelect) {
				if (!this._preSelect(model)) {
					return;
				}
			}
    		this._select(model);
			this.$scope.validateFinalResult = true;
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
			this.$scope.validateFinalResult = false;
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
