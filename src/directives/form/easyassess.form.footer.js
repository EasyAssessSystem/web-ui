var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esFormFooter"]
    = EasyAssess.app.directive("esFormFooter", function() {

    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template: '<div class="es-form-footer"><es-text-box es-content="{{esFooter.content}}" es-change-callback="contentChange(val)" es-editable="{{esEditable}}" class="es-form-footer-text" es-placeholder="' + EasyAssess.lang.forms.footer.inputStatementText + '..."></es-text-box></div>',
        scope: {
            esFooter:"=",
            esEditable:"@?"
        },
        controller: ["$scope", function($scope, $element, $attrs){
            $scope.contentChange = function(val) {
                $scope.esFooter.content = val;
            }
        }],
        link: function(scope) {
            if (!scope.esEditable){
                scope.esEditable = true;
            }
        }
    }

});
