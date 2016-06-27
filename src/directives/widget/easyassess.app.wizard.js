var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppWizard"]
    = EasyAssess.app.directive("esAppWizard", function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div>'
                  +'<div ng-transclude class="es-wizard"></div>'
                  +'<div class="btn-group">'
                  +'<button ng-click="prev()" ng-if="currentPage != 0" type="button" class="btn btn-primary">上一步</button>'
                  +'<button ng-click="next()" ng-if="currentPage < pageCount - 1" type="button" class="btn btn-primary">下一步</button>'
                  +'<button ng-click="finish()" ng-if="currentPage == pageCount - 1" type="button" class="btn btn-primary">完成</button>'
                  +'</div>'
                  +'</div>',
        scope: {},
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
                $scope.$emit('$wizard_complete');
            }

            $scope.go = function(pageIdx) {
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
        },
        template: '<div><div class="" ng-if="selected"" ng-transclude></div></div>',
        link: function($scope,$element,$attrs,$parentController) {
            $parentController.append($scope);
        },
        controller: ["$scope",function($scope,$element,$attrs) {

        }],
    };
});
