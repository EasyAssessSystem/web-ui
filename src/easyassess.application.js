var angular = require('angular');
var router = require('angular-ui-router');

require('./components/assessment.html');
require('./components/notices.html');
require('./components/user.html');
require('./components/user_detail.html');
require('./components/role.html');
require('./components/health_ministry.html');
require('./components/assay_category.html');
require('./components/code_group.html');
require('./components/assay_code.html');
require('./components/template.html');
require('./components/assessment_detail.html');
require('./components/assessment_new.html');
require('./components/closed_form.html');
require('./components/activated_form.html');
require('./components/iqc_template.html');
require('./components/iqc_plan.html');
require('./components/iqc_plan_ministry.html');
require('./components/iqc_plan_ministry_forms.html');
require('./components/iqc_new.html');
require('./components/iqc_form.html');
require('./components/iqc_form_active.html');
require('./components/iqc_form_closed.html');
require('./components/iqc_form_detail.html');

/**
 * Created by alexli on 2016/4/3.
 * Edited by aaronchen on 2016/5/14
 */
var EasyAssess = {
    version: '1.0.0',
    copyright:'Stardust',
    author: 'Li, Cheng;Chen, Dong',
    description: 'EasyAssess Application Namespace'
}

EasyAssess.session = {};

var env = function() {
	var options = {};
	angular.extend(options,  window._activeEnv);
	for (var k in options) {
		if (options[k].indexOf("${host}") != -1) {
			options[k] = options[k].replace("${host}", window.location.origin + "/");
		}
	}
	return options;
}

EasyAssess.environments = {
		pdm: function(domain) {
			return env().pdm + (domain ? domain : EasyAssess.session.domain) + '/data/'
		},

		assess: function(domain) {
			return env().assess + (domain ? domain : EasyAssess.session.domain) + '/assess/'
		},

		iqc: function(domain) {
			return env().iqc + (domain ? domain : EasyAssess.session.domain) + '/iqc/'
		}
};



EasyAssess.activeEnv = EasyAssess.environments;


/**
 * Define application
 */
EasyAssess.app = angular.module("EasyAssessApp",[
	require('angular-ui-router'),
	require('angular-animate'),
	require('angular-sanitize'),
	require('ng-dialog'),
	require('angular-ui-bootstrap/src/dropdown'),
	require('angular-date-picker').name,
	require('angular-ui-tree'),
	require('angular-chart.js'),
	require('angular-bootstrap-calendar'),
	require('angular-ui-bootstrap'),
	require('ng-file-upload'),
	require('ng-quill')
],function($controllerProvider){
	EasyAssess.app.controllerProvider = $controllerProvider;
});

EasyAssess.formApp = angular.module("EasyAssessForm",
		[require('angular-sanitize'), require('ng-dialog')],function(){

});

EasyAssess.app.factory('localStorage',['$window',function($window){
	return{
		set :function(key,value){
			$window.localStorage[key]=value;
		},
		get:function(key,defaultValue){
			return  $window.localStorage[key] || defaultValue;
		},
		setObject:function(key,value){
			$window.localStorage[key]=JSON.stringify(value);
		},
		getObject: function (key) {
			return JSON.parse($window.localStorage[key] || '{}');
		}

	}
}])

/**
 * Application config
 */
EasyAssess.app.config(
	function($stateProvider, $urlRouterProvider,$httpProvider,moment,calendarConfig) {
		EasyAssess.app.stateProvider = $stateProvider;
		EasyAssess.app.urlRouterProvider = $urlRouterProvider;
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
		moment.locale('zh-cn');
		calendarConfig.dateFormatter = 'moment';
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
	{"value": ""},
	{"value": "S/CO"},
	{"value": "IU/mL"},
	{"value": "mIU/mL"},
	{"value": "mIU/mL"},
	{"value": "TCID50"},
	{"value": "CT"}
];

EasyAssess.utils = {
	generateGUID: function (){
		function S4() {
	       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	    }
	    return (S4()+S4()+"-"+S4()+S4()+"-"+S4()+S4()+S4());
	}
};

//EasyAssess.currentpermissionState = "assessment";
EasyAssess.session = {};
EasyAssess.TaskManager = {
	_loaded:false,

	_history: [],

	getHistory: function() {
		return this._history;
	},

	back: function() {
		this._history.pop();
		var item = this._history.pop();
		if (item) {
			this.start(item.module, item.state, item.options, item.statePrams);
		}
	},

	start: function(module, state, options, statePrams, ignoreHistory) {
		if(!this._loaded){
			require('./easyassess.application.state');
			this._loaded = true;
		}

		if (!ignoreHistory) {
			if (this._history.length >= 6) {
				this._history.shift();
			}

			this._history.push({
				"module": module,
				"state": state,
				"options": options,
				"statePrams": statePrams
			});
		}

		if (!statePrams) {
			state.go(module, {});
		} else {
			state.go(module, statePrams);
		}


		var parentModule;

		if(module.indexOf('.') > -1){
			parentModule = module.split('.')[0];
		}else{
			parentModule = module;
		}

		this.module = {
			module: module,
			permissions: EasyAssess.session.componentPermissionMap[parentModule]
		};
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

		this._statusMap = {
			"A": EasyAssess.lang.pages.common.statusActiveText,
			"U": EasyAssess.lang.pages.common.statusInactiveText
		};

		this._service = EasyAssess.activeEnv.pdm();

		this._permission = EasyAssess.TaskManager.current().permissions;

		if (this._initialize) {
			this._initialize.apply(this, arguments);
		}

		this.__default.apply(this, arguments);

		this._postInitialize();
	},

	_postInitialize: function() {
		this._restrict();
		this._filterOptions();
		this.$scope.lang = EasyAssess.lang;
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

	_isStringId: function (id) {
		return typeof (id) === "string" && id.length > 0;
	},

	_save: function () {
		var $http = this.$http;
		var $scope = this.$scope;

		if (this.$scope.activeModel.id > 0 || this._isStringId(this.$scope.activeModel.id)) {
			this.esRequestService.esPut(this._service + $scope.resource + '/' + $scope.activeModel.id,$scope.activeModel)
				.then((function(result){
					if (this._postSave) {
						this._postSave(result.data)
					}
					if (this._showSaveMessage) {
						EasyAssess.QuickMessage.message(EasyAssess.lang.pages.common.msgSaveCompleted);
					} else {
						$scope.activeModel = null;
					}
				}).bind(this));
		} else {
			this.esRequestService.esPost(this._service + $scope.resource,$scope.activeModel)
				.then((function(result){
					if (this._postSave) {
						this._postSave(result.data)
					}
					if (this._showSaveMessage) {
						EasyAssess.QuickMessage.message(EasyAssess.lang.pages.common.msgSaveCompleted);
					} else {
						$scope.activeModel = null;
					}
				}).bind(this));
		}
	},

	_delete: function() {
		this.ngDialog.openConfirm({
			template:   '<div class="ngdialog-message">' + EasyAssess.lang.pages.common.msgConfirmDelete + '</div>'
			+ '<div align="right"><button ng-click="confirm()" class="btn btn-primary">' + EasyAssess.lang.pages.common.okText + '</button><button ng-click="closeThisDialog()" class="btn btn-primary">' + EasyAssess.lang.pages.common.cancelText + '</button></div>',
			plain: true
		}).then(
			(function(value){
				if (this.$scope.activeModel.id > 0 || this._isStringId(this.$scope.activeModel.id)) {
					this.esRequestService.esDelete(this._service + this.$scope.resource + '/' + this.$scope.activeModel.id)
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
			{text: EasyAssess.lang.pages.common.statusActiveText, value: "A"},
			{text: EasyAssess.lang.pages.common.statusInactiveText, value: "U"}
		];

		$scope.$watch('activeModel',function(newValue, oldValue, scope){
			if (newValue == null) {
				$scope.$broadcast('$refresh');
			}
		});

		$scope.$on('$preLookup', (function(e, condition){
			if (this._statusMap && condition.by == "status" && condition.keyword) {
				for (var key in this._statusMap) {
					if (this._statusMap[key].indexOf(condition.keyword) == 0) {
						condition.keyword = key;
					}
				}
			}
		}).bind(this));

		$scope.$on('$postLookup', (function(e, rows){
			rows.map((function(row){
				if (row.status && this._statusMap) {
					row.status = this._statusMap[row.status];
				}
			}).bind(this));
		}).bind(this));

			$scope.$on('$selected', (function (e, model) {
				if (this._preSelect) {
					if (!this._preSelect(model)) {
						return;
					}
				}
				this._select(model);
				this.$scope.validateFinalResult = true;
				if (this._postSelect) {
					this._postSelect(model);
				}
			}).bind(this));

			$scope.$on('$cancel', (function (e) {
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

EasyAssess.app.directive('convertToNumber', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {
			ngModel.$parsers.push(function(val) {
				return val != null ? parseInt(val, 10) : null;
			});
			ngModel.$formatters.push(function(val) {
				return val != null ? '' + val : null;
			});
		}
	};
});

EasyAssess.app.directive('contenteditable', ['$sce', function($sce) {
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function(scope, element, attrs, ngModel) {
			if (!ngModel) return;
			ngModel.$render = function() {
				element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
			};

			element.on('blur keyup change', function() {
				scope.$evalAsync(read);
			});
			read();

			function read() {
				var html = element.html();
				if ( attrs.stripBr && html == '<br>' ) {
					html = '';
				}
				ngModel.$setViewValue(html);
			}
		}
	};
}]);

EasyAssess.QuickMessage = {

	_display: function (message, error) {
		var time = 1500;
		if ($(".es-quick-message").text().length > 0) {
			var msg = $("<span class='es-quick-message-span " + error + "'>" + message + "</span>");
			$(".es-quick-message").empty().append(msg);
		} else {
			var msg = $("<div class='es-quick-message'><span class='" + error + "'>" + message + "</span></div>");
			$("body").append(msg);
		}
		$(".es-quick-message").fadeIn(500);
		setTimeout(function(){$(".es-quick-message").fadeOut(time);}, time);
	},

	message: function(message) {
		this._display(message);
	},

	error: function(message) {
		this._display(message, "error");
	}
};

EasyAssess.lang = window.langEnv === 'en' ? require('./langs/en') : require('./langs/cn');

module.exports = EasyAssess;

