var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormNoticeEditor"]
	= EasyAssess.app.directive("esFormNoticeEditor", function(ngDialog, esRequestService) {
	
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		template:   '<div>'
							+			'<es-app-tab-pane>'
			        +    		'<es-app-tab es-active="true" es-ref="editNotices" es-title="' + EasyAssess.lang.forms.notice.announcementManagementsText + '">'
							+ 			'<table class="table table-striped" ng-if="!activeModel">'
							+ 				'<tbody>'
							+ 					'<tr ng-if="article" ng-repeat="article in articles"><td ng-click="selectArticle(article)">{{article.subject}}</td><td><span class="glyphicon glyphicon-remove es-delete-button" ng-click="remove(article)"></span></td></tr>'
							+ 				'</tbody>'
							+ 			'</table>'
							+					'<es-app-textbox es-placeholder="' + EasyAssess.lang.forms.notice.inputTitleText + '" ng-if="activeModel" es-model="activeModel.subject"></es-app-textbox>'
							+					'<ng-quill-editor ng-if="activeModel" ng-model="activeModel.content"></ng-quill-editor>'
							+					'<es-add-button ng-if="!activeModel" ng-click="createNew()" es-text="' + EasyAssess.lang.forms.notice.addNewButtonText + '"></es-add-button>'
							+ 				'<div ng-if="activeModel" class="es-dialog-form-line" align="right">'
							+						'<button ng-click="submit()" class="btn btn-primary">' + EasyAssess.lang.pages.common.okText + '</button>'
							+						'<button ng-click="cancel()" class="btn btn-primary">' + EasyAssess.lang.pages.common.cancelText + '</button>'
							+ 				'</div>'
							+				'</es-app-tab>'
							+    		'<es-app-tab es-ref="editAssets" es-title="' + EasyAssess.lang.forms.notice.assetsManagementText + '">'
							+				'</es-app-tab>'
							+			'</es-app-tab-pane>'
							+ '</div>',
		scope: {
			esAssessmentId: "@"
		},
		controller: ["$scope", function($scope, $element, $attrs){
			$scope.activeModel = null;

			$scope.createNew = function () {
				$scope.activeModel = {
					subject: "",
					content: ""
				}
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

			$scope.getArticles();
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