var EasyAssess = require('../../easyassess.application');
var copy = require('copy-to-clipboard');


EasyAssess.directives["esFormNoticeEditor"]
	= EasyAssess.app.directive("esFormNoticeEditor", function(ngDialog, esRequestService, Upload) {
	
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:   '<div>'
							+			'<es-app-tab-pane>'
			        +    		'<es-app-tab es-active="true" es-ref="editNotices" es-title="' + EasyAssess.lang.forms.notice.announcementManagementsText + '">'
							+ 			'<table class="table table-striped" ng-if="!activeModel" style="margin-top: 10px;">'
							+ 				'<tbody>'
							+ 					'<tr ng-if="article" ng-repeat="article in articles"><td ng-click="selectArticle(article)">{{article.subject}}</td><td title="' + EasyAssess.lang.forms.notice.deleteText + '"><a href="javascript:void(0)"><span class="glyphicon glyphicon-remove" ng-click="remove(article)"></span></a></td></tr>'
							+ 				'</tbody>'
							+ 			'</table>'
							+					'<es-app-textbox es-placeholder="' + EasyAssess.lang.forms.notice.inputTitleText + '" ng-if="activeModel" es-model="activeModel.subject"></es-app-textbox>'
							+					'<ng-quill-editor placeholder="' + EasyAssess.lang.forms.notice.placeholderText + '" ng-if="activeModel" ng-model="activeModel.content"></ng-quill-editor>'
							+					'<es-add-button ng-if="!activeModel" ng-click="createNew()" es-text="' + EasyAssess.lang.forms.notice.addNewButtonText + '"></es-add-button>'
							+ 				'<div ng-if="activeModel" class="es-dialog-form-line" align="right">'
							+						'<button ng-click="submit()" class="btn btn-primary">' + EasyAssess.lang.pages.common.okText + '</button>'
							+						'<button ng-click="cancel()" class="btn btn-primary">' + EasyAssess.lang.pages.common.cancelText + '</button>'
							+ 				'</div>'
							+				'</es-app-tab>'
							+    		'<es-app-tab es-ref="editAssets" es-title="' + EasyAssess.lang.forms.notice.assetsManagementText + '">'
							+ 				'<table class="table table-striped" style="margin-top: 10px;">'
							+ 					'<tbody>'
							+ 						'<tr ng-if="asset" ng-repeat="asset in assets">'
							+								'<td>{{asset.title}}</td>'
							+								'<td title="' + EasyAssess.lang.forms.notice.copyToClipboardText + '" style="width: 20px;"><a href="javascript:void(0)"><span class="glyphicon glyphicon-folder-open" style="width: 20px;" ng-click="copyAssetUrl(asset)"></span></a></td>'
							+								'<td title="' + EasyAssess.lang.forms.notice.downloadText + '" style="width: 20px;"><a href="{{asset.url}}"><span class="glyphicon glyphicon glyphicon-download-alt" style="width: 20px;"></span></a></td>'
							+								'<td title="' + EasyAssess.lang.forms.notice.deleteText + '" style="width: 20px;"><a href="javascript:void(0)"><span class="glyphicon glyphicon-remove" ng-click="removeAsset(asset)"></span></a></td>'
							+							'</tr>'
							+ 					'</tbody>'
							+ 				'</table>'
							+					'<a href="javascript:void(0)" ngf-select ng-model="file" ngf-change="upload($file)" name="file" ngf-max-size="50MB" ngf-min-height="100"><es-add-button es-text="' + EasyAssess.lang.forms.notice.addNewButtonText + '"></es-add-button></a>'
							+				'</es-app-tab>'
							+			'</es-app-tab-pane>'
							+ '</div>',
		scope: {
			esAssessmentId: "@"
		},
		controller: ["$scope", function($scope, $element, $attrs){
			$scope.activeModel = null;
			$scope.file = null;
			$scope.createNew = function () {
				$scope.activeModel = {
					subject: "",
					content: ""
				}
			};

			$scope.copyAssetUrl = function (asset) {
				copy(asset.url);
				EasyAssess.QuickMessage.message(EasyAssess.lang.forms.notice.msgCopySuccessfullyText);
			};

			$scope.upload = function (file) {
				if (!file) return;
				Upload.upload({
					url: EasyAssess.activeEnv.assess() + "assessment/" + $scope.esAssessmentId + "/assets",
					data: {
						'asset': file
					},
					withCredentials: true
				}).success(function (data, status, headers, config) {
					$scope.getAssets();
				}).error(function (data, status, headers, config) {

				});
			};

			$scope.selectArticle = function (article) {
				$scope.activeModel = article;
			};

			$scope.getArticles = function () {
				return new Promise(function (resolve) {
					esRequestService.esGet(EasyAssess.activeEnv.assess() + "assessment/" + $scope.esAssessmentId + "/articles").then(
						function (response) {
							$scope.articles = response.data;
							resolve();
						}
					);
				})
			};

			$scope.getAssets = function () {
				return new Promise(function (resolve) {
					esRequestService.esGet(EasyAssess.activeEnv.assess() + "assessment/" + $scope.esAssessmentId + "/assets").then(
						function (response) {
							$scope.assets = response.data;
							resolve();
						}
					);
				})
			};

			$scope.submit = function () {
				var url = $scope.activeModel.id ? EasyAssess.activeEnv.assess() + "assessment/" + $scope.esAssessmentId + "/articles/" + $scope.activeModel.id : EasyAssess.activeEnv.assess() + "assessment/" + $scope.esAssessmentId + "/articles";
				var updateFunc = $scope.activeModel.id ? esRequestService.esPut : esRequestService.esPost;
				updateFunc(url, $scope.activeModel).then(
					function (response) {
						$scope.getArticles().then(function () {
							$scope.activeModel = null;
							EasyAssess.QuickMessage.message(EasyAssess.lang.forms.notice.msgSaveSuccessfullyText);
						});
					}
				);
			};

			$scope.cancel = function () {
				$scope.activeModel = null;
			};

			$scope.remove = function (article) {
				ngDialog.openConfirm({
					template:   '<div class="ngdialog-message">' + EasyAssess.lang.forms.notice.msgConfirmDeleteText + '</div>'
					+ '<div align="right"><button ng-click="confirm()" class="btn btn-primary">' + EasyAssess.lang.pages.common.okText + '</button><button ng-click="closeThisDialog()" class="btn btn-primary">' + EasyAssess.lang.pages.common.cancelText + '</button></div>',
					plain: true
				}).then(
					(function(){
						esRequestService.esDelete(EasyAssess.activeEnv.assess() + "assessment/" + article.assessmentId + "/articles/" + article.id)
							.then((function(){
								$scope.getArticles();
							}).bind(this));
					}).bind(this),
					function(reason){
					}
				);
			};

			$scope.removeAsset = function (asset) {
				ngDialog.openConfirm({
					template:   '<div class="ngdialog-message">' + EasyAssess.lang.forms.notice.msgConfirmDeleteText + '</div>'
					+ '<div align="right"><button ng-click="confirm()" class="btn btn-primary">' + EasyAssess.lang.pages.common.okText + '</button><button ng-click="closeThisDialog()" class="btn btn-primary">' + EasyAssess.lang.pages.common.cancelText + '</button></div>',
					plain: true
				}).then(
					(function(){
						esRequestService.esDelete(EasyAssess.activeEnv.assess() + "assessment/" + $scope.esAssessmentId + "/assets/" + asset.id)
							.then((function(){
								$scope.getAssets();
							}).bind(this));
					}).bind(this),
					function(reason){
					}
				);
			};

			$scope.getArticles();
			$scope.getAssets();
		}]
	}
});

EasyAssess.directives["esFormNoticeRichEditor"]
	= EasyAssess.app.directive("esFormNoticeRichEditor", function() {

	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:   '<div></div>',
		scope: {
		},
		controller: ["$scope", function($scope, $element, $attrs){
		}]
	}
});