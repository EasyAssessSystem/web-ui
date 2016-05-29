var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAddNew"]
    = EasyAssess.app.directive("esAddNew", function() {

    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template: '<div ng-click="addNew()"><span class="glyphicon glyphicon-plus-sign"></span><a style="text-decoration: underline;padding-left: 5px;" ng-bind="esText"></a></div>',
        scope: {
            esText:"@"
        },
        controller: ["$scope", function($scope, $element, $attrs){
            $scope.addNew = function(){
                $scope.$emit('$added');
            };
        }],
        link: function(scope, ele, attrs, ctrl) {

        }
    }

});
