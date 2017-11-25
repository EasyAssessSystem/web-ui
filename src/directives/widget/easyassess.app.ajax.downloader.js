var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppAjaxDownloader"]
    = EasyAssess.app.directive("esAppAjaxDownloader", function($http, esRequestService) {
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template:   '<div>'
                    +   '<button class="btn btn-primary" ng-click="ajaxDownload()">'
                    +     '{{esButtonText}}'
                    +   '</button>'
                    + '</div>',
        scope: {
            esUrl: "@",
            esMethod: "@?",
            esData: "=?",
            esFilename: "@",
            esFileType: "@",
            esButtonText: "@?"
        },
        controller: ["$scope", function ($scope, $element, $attrs) {
            if (!$scope.esMethod) {
                $scope.esMethod = 'get';
            }

            if (!$scope.esButtonText) {
                $scope.esButtonText = EasyAssess.lang.widgets.downloader.defaultButtonText;
            }

            if (!$scope.esData) {
                $scope.esData = {};
            }

            function getBlobType() {
                switch ($scope.esFileType) {
                    case 'xls':
                    case 'xlsx':
                        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    break;
                    default:
                        EasyAssess.QuickMessage.error(EasyAssess.lang.widgets.downloader.msgFileTypeError);
                        break
                }
            }

            $scope.ajaxDownload = function () {
                $http.post($scope.esUrl, $scope.esData, {
                    withCredentials: true,
                    responseType: 'arraybuffer'
                }).success(function (data) {
                    var blob = new Blob([data], {type: getBlobType()});
                    var objectUrl = URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    document.body.appendChild(a);
                    a.setAttribute('style', 'display:none');
                    a.setAttribute('href', objectUrl);
                    a.setAttribute('download', $scope.esFilename);
                    a.click();
                    URL.revokeObjectURL(objectUrl);
                });
            }
        }]
    }
});
