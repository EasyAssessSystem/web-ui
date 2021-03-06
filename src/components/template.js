var EasyAssess = require('../easyassess.application');

EasyAssess.app.TemplateController = function($scope, $timeout, $state, $stateParams, ngDialog, esRequestService, ngDialog) {
	this.initialize.apply(this, arguments);
};

EasyAssess.app.TemplateController.prototype = EasyAssess.extend({
	initialize: function($scope, $timeout, $state, $stateParams, ngDialog, esRequestService, ngDialog) {
		$scope.lang = EasyAssess.lang;

		$scope.templateGuid = $state.params.id;
		$scope.sharingOptions = {
			enableSharing: false
		};

		if ($scope.templateGuid) {
			esRequestService.esGet(EasyAssess.activeEnv.assess() + "template/" + $scope.templateGuid).then(
				function(response) {
					var model = response.data;
					$scope.activeModel = model;
					if (!$scope.activeModel.footer) {
						$scope.activeModel.footer = {content:null};
					}
					$timeout(function(){
						$scope.$apply(function () {
							for (var key in model) {
								if (key == 'enableSharing') continue;
								$scope[key] = model[key];
							}
							$scope.sharingOptions.enableSharing = false;
						});
					},100)
				}
			);
		}

		$scope.lookupFields = [
			{title: EasyAssess.lang.pages.assessmentTemplate.nameText, field:"header.name", type:"string",searchable:true,default:true},
			{title: EasyAssess.lang.pages.assessmentTemplate.templateScopeTemplateText, field:"enableSharing", type:"string",searchable:false},
		];

		$scope.groups = [];

		$scope.header = {
			name: null
		}

		$scope.footer = {
			content: null
		}

		$scope.addGroup = function() {
			$scope.groups.push({
				"guid": EasyAssess.utils.generateGUID(),
				"name": null,
				"specimens":[],
				"codeGroups":[],
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

		$scope.save = function() {
			esRequestService.esPost(EasyAssess.activeEnv.assess() + "template",
				angular.toJson({
					"id": $scope.activeModel ? $scope.id : null,
					"guid": $scope.activeModel? $scope.activeModel.guid:EasyAssess.utils.generateGUID(),
					"header": $scope.header,
					"footer": $scope.footer,
					"groups": $scope.groups,
					"status": $scope.status,
					"enableSharing": $scope.sharingOptions.enableSharing
				})).then(
					function(response) {
						EasyAssess.QuickMessage.message(EasyAssess.lang.pages.assessmentTemplate.msgSaveSuccessText);
						$scope.activeModel = response.data;
					}
				);
		}

		$scope.remove = function() {
			ngDialog.openConfirm({
				template:   '<div class="ngdialog-message">'+ EasyAssess.lang.pages.assessmentTemplate.msgDeleteConfirmText + '?</div>'
				+ '<div align="right"><button ng-click="confirm()" class="btn btn-primary">' + EasyAssess.lang.pages.assessmentTemplate.okButtonText + '</button><button ng-click="closeThisDialog()" class="btn btn-primary">' + EasyAssess.lang.pages.assessmentTemplate.cancelButtonText + '</button></div>',
				plain: true
			}).then(
				(function(value){
					esRequestService.esDelete(EasyAssess.activeEnv.assess() + "template/" + $scope.activeModel.id).then(function(){
						EasyAssess.QuickMessage.message(EasyAssess.lang.pages.assessmentTemplate.msgDeleteSuccessText);
						$scope.createFromScratch();
					});
				}).bind(this),
				function(reason){
				}
			);
		}

		$scope.$on('$templateLookup_selected', function(e, model){
			$scope.activeModel = model;
			if (!$scope.activeModel.footer) {
				$scope.activeModel.footer = {content:null};
			}
			$timeout(function(){
				$scope.$apply(function () {
					for (var key in model) {
						if (key == 'enableSharing') continue;
						$scope[key] = model[key];
					}
					$scope.sharingOptions.enableSharing = model.enableSharing
				});
			},100)
		});

		$scope.new = function() {
			ngDialog.open({
				template: '<div class="es-dialog-content">'
									+	'<div class="es-dialog-form-line">'
									+ 	'<es-app-lookup es-width="300" es-id="sharedTemplateLookup" es-provider="button" es-label="'+ EasyAssess.lang.pages.assessmentTemplate.createFromSharedTemplateText + '" es-columns="lookupFields" es-service="assess" es-resource="template/shared/list"></es-app-lookup>'
									+		'<button style="width: 300px;" class="btn btn-success" ng-click="createFromScratch()"><span class="glyphicon glyphicon-file"></span><span class="es-icon-button-text">' + EasyAssess.lang.pages.assessmentTemplate.createFromScratchText + '</span></button>'
									+	'</div>'
									+ '<div class="es-dialog-form-line" align="right"></div>'
									+'</div>',
				plain: true,
				controller: ['$scope', function($dialog) {
					$dialog.lookupFields = $scope.lookupFields;

					$dialog.$on('$sharedTemplateLookup_selected', function(e, model){
						$scope.createFromSharedTemplate(model);
						$dialog.closeThisDialog();
					});

					$dialog.$on('$sharedTemplateLookup_postLookup', (function(e, rows){
						rows.forEach((function(row){
							return  row.enableSharing = row.enableSharing ? EasyAssess.lang.pages.assessmentTemplate.publicTemplateText:EasyAssess.lang.pages.assessmentTemplate.privateTemplateText;
						}).bind(this));
					}).bind(this));

					$dialog.createFromScratch = function () {
						$dialog.closeThisDialog();
						$scope.createFromScratch();
					};
				}]
			});
		};

		$scope.createFromScratch = function () {
			$timeout(function(){
				$scope.$apply(function () {
					$scope.activeModel = null;
					$scope.header = {name:null};
					$scope.footer = {content:null};
					$scope.groups = [];
					$scope.sharingOptions.enableSharing = true;
				});
			},100);
		};

		$scope.createFromSharedTemplate = function (model) {
			$scope.header = model.header;
			$scope.footer = model.footer;
			$scope.groups = model.groups;
			$scope.sharingOptions.enableSharing = false;
			$scope.activeModel = null;
		};

		$scope.copy = function() {
			$scope.header = {name:$scope.header.name + " - " + "Copy"};
			$scope.activeModel = null;
			$scope.save();
		}

		$scope.isAdmin = EasyAssess.session.currentUser.ministries.length === 0;

		// $scope.$on('$preLookup', (function(e, condition){
		// 	if (this._statusMap && condition.by == "status" && condition.keyword) {
		// 		for (var key in this._statusMap) {
		// 			if (this._statusMap[key].indexOf(condition.keyword) == 0) {
		// 				condition.keyword = key;
		// 			}
		// 		}
		// 	}
		// }).bind(this));

		$scope.$on('$templateLookup_postLookup', (function(e, rows){
			rows.forEach((function(row){
				return  row.enableSharing = row.enableSharing ? EasyAssess.lang.pages.assessmentTemplate.publicTemplateText:EasyAssess.lang.pages.assessmentTemplate.privateTemplateText;
			}).bind(this));
		}).bind(this));
	}
}, {});

EasyAssess.app.registerController("templateController", EasyAssess.app.TemplateController);
