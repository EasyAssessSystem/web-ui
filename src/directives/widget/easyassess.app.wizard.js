var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppWizard"]
    = EasyAssess.app.directive("esAppWizard", function(ngDialog) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div>'
                  +'<div class="es-error-message" ng-if="error">{{error}}</div>'
                  +'<div class="es-info-message" ng-if="info">{{info}}</div>'
                  +'<div ng-transclude class="es-wizard" style="padding-top: 10px;"></div>'
                  +'<div class="btn-group">'
                  +'<button ng-click="prev()" ng-if="currentPage != 0" type="button" class="btn btn-primary">' + EasyAssess.lang.widgets.wizard.prevButtonText + '</button>'
                  +'<button ng-click="next()" ng-if="currentPage < pageCount - 1" type="button" class="btn btn-primary">' + EasyAssess.lang.widgets.wizard.nextButtonText + '</button>'
                  +'<button ng-click="finish()" ng-if="currentPage == pageCount - 1" type="button" class="btn btn-primary">' + EasyAssess.lang.widgets.wizard.finishButtonText + '</button>'
                  +'</div>'
                  +'</div>',
        scope: {
            esConfirmMessage: "@"
        },
        controller: ["$scope",function($scope) {
            $scope.pages = [];
            this.append = function (page) {
                $scope.pages.push(page);
                $scope.pageCount = $scope.pages.length;
            };

            $scope.next = function() {
                $scope.go($scope.currentPage + 1);
            }

            $scope.prev = function() {
                $scope.go($scope.currentPage - 1);
            }

            $scope.finish = function() {
                if ($scope.pageCount && $scope.pages[$scope.pageCount - 1].esStepValidator) {
                    var result = $scope.pages[$scope.pageCount - 1].esStepValidator();
                    if (typeof result == "string") {
                        $scope.error = result;
                        return;
                    } else if (typeof result == "boolean") {
                        if (!result) return;
                    }
                }

                if ($scope.esConfirmMessage) {
                    ngDialog.openConfirm({
                        template: '<div class="ngdialog-message">' + $scope.esConfirmMessage + '</div>'
                        + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">' + EasyAssess.lang.widgets.wizard.okButtonText + '</button><button ng-click="closeThisDialog()" class="btn btn-primary">' + EasyAssess.lang.widgets.wizard.cancelButtonText + '</button></div>',
                        plain: true
                    }).then(
                        (function(value){
                            $scope.$emit('$wizard_complete');
                        }).bind(this),
                        function(reason){
                        }
                    );
                } else {
                    $scope.$emit('$wizard_complete');
                }
            }

            $scope.go = function(pageIdx) {
                var prePageIdx = pageIdx - 1;
                if (prePageIdx >=0 && $scope.pages[prePageIdx].esStepValidator) {
                    var result = $scope.pages[prePageIdx].esStepValidator();
                    if (typeof result == "string") {
                        $scope.error = result;
                        return;
                    } else if (typeof result == "boolean") {
                        if (!result) return;
                    }
                }

                $scope.error = null;
                $scope.message = null;

                angular.forEach($scope.pages, function(page, index) {
                    if (pageIdx == index) {
                        page.selected = true;
                    } else {
                        page.selected = false;
                    }
                });

                $scope.currentPage = pageIdx;
            };
        }],
        link: function($scope){
            if ($scope.pages.length > 0) {
                $scope.go(0);
            }
        }
    };
});

EasyAssess.directives["esAppWizardContent"]
    = EasyAssess.app.directive("esAppWizardContent", function() {
    return {
        require:'^esAppWizard',
        restrict: 'E',
        replace: true,
        transclude: true,
        scope:{
            esStepValidator: "&?"
        },
        template: '<div><div class="" ng-if="selected"" ng-transclude></div></div>',
        link: function($scope,$element,$attrs,$parentController) {
            $parentController.append($scope);
        },
        controller: ["$scope",function($scope,$element,$attrs) {

        }],
    };
});
