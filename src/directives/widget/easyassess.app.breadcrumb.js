var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppBreadcrumb"]
    = EasyAssess.app.directive("esAppBreadcrumb", function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div>'
        +'<ol class="breadcrumb">'
        +'<li ng-repeat="item in esItems" ng-click="click(item.bindfunc)"><a href="#">{{item.name}}</a></li>'
        +'</ol>'
        +'</div>',
        scope: {
            esItems:"="
        },
        link: function(scope){
            scope.click = function(func){
                func();
            }
        }
    };
});
