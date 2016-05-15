var $ = require('jQuery');
window.$ = $;
require('../node_modules/angular-dropdowns/dist/angular-dropdowns.css');
require('../node_modules/ng-dialog/css/ngDialog.min.css');
require('../node_modules/ng-dialog/css/ngDialog-theme-default.min.css');
require('../node_modules/ng-dialog/css/ngDialog-theme-plain.min.css');
require('../node_modules/ng-dialog/css/ngDialog-custom-width.css');
require('./css/es.theme.css')

var EasyAssess = require('./easyassess.application');
var template = require('./data/template');
require('./directives/form/easyassess.form.textbox');
require('./directives/form/easyassess.form.addbutton');
require('./directives/form/easyassess.form.header');
require('./directives/form/easyassess.form.group');
require('./directives/form/easyassess.form.page');
var angular = require('angular');

var app = angular.module("formEditorApp",[EasyAssess.formApp.name]);
app.controller("formEditorController", function($scope,ngDialog) {
	$scope.groups = [];
	
	$scope.header = {
		name: null
	}

	$scope.addGroup = function() {
		 	console.log(EasyAssess);
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
	

	function save(templateName) {
		$.ajax({
		    url : "../form/editor",
		    type : "PUT", 
		    dataType:"json",
		    contentType:'application/json;charset=UTF-8',
		    data: angular.toJson({
		    	"guid": EasyAssess.utils.generateGUID(),
		    	"formName": templateName,
		    	"header": $scope.header,
		    	"groups": $scope.groups
		    }),
		    success : function(data) {
		        alert(JSON.stringify(data));   
		    },
			error:function(e){
		    	  
		    }  
		});
	}
	
	$scope.open = function() {
		setTimeout(function(){
			$scope.$apply(function () {
				for (var key in template) {
					$scope[key] = template[key];
				}
		    });
		},100)
	}
	
	$scope.save = function() {
		ngDialog.open({
              template: '<div class="es-dialog-content"><div class="es-dialog-form-line"><input class="form-control" style="width:300px;" placeholder="输入报告模板名" es-ids="txtFormName"/></div>'
              		+ '<div class="es-dialog-form-line" align="right"><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
              plain: true,
              controller: ['$scope', function($saveDialog) {
              	$saveDialog.submit = function(){
              		save($('[es-ids=txtFormName]').val())
              		$saveDialog.closeThisDialog();
                  }
              }]
    		 });
	}
});