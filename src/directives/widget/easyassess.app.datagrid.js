var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppDatagrid"]
    = EasyAssess.app.directive("esAppDatagrid", function ($http, esRequestService) {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: function ($element, $attr) {
            var tpl = '<div>'
                + '<es-app-filter es-search-options="esOptions"></es-app-filter>'
                + '<table class="table table-striped">'
                + '<thead><tr>'
                + '<th ng-repeat="column in esColumns" style="cursor:pointer;"><span ng-bind="column.title"></span></th>'
                + '</tr></thead>'
                + '<tr ng-show="isLoading" style="padding:20px 20px 20px 20px;"><td colspan="{{esColumns.length}}"><es-spinner></es-spinner></td></tr>'
                + '<tr ng-hide="isLoading" ng-click="select(rec,$event)" ng-repeat="rec in esData" style="cursor:pointer;">'
                + '<td ng-repeat="column in esColumns"><div ng-if="column.template"><span data-btn="1" type="button" class="btn btn-default" ng-click="clickBtn()">{{column.text}}</span></div><span ng-if="!column.template" ng-bind="rec.{{column.field}}"></span></td>'
                + '</tr>'
                + '</table>'
                + '<div ng-show="pagination.length">'
                + '<ul class="pagination pagination-sm">'
                + '<li><a ng-click="first()" href="javascript:void(0)"><span class="glyphicon glyphicon-backward"></span></a></li>'
                + '<li><a ng-click="previous()" href="javascript:void(0)"><span class="glyphicon glyphicon-chevron-left"></span></a></li>'
                + '<li ng-repeat="n in pagination"><a ng-if="n != pageNum"ng-click="jump(n)" href="javascript:void(0)">{{n}}</a><span ng-if="n == pageNum" style="color:black">{{n}}</span></li>'
                + '<li><a ng-click="next()" href="javascript:void(0)"><span class="glyphicon glyphicon-chevron-right"></span></a></li>'
                + '<li><a ng-click="last()" href="javascript:void(0)"><span class="glyphicon glyphicon-forward"></span></a></li>'
                + '</ul>'
                + '</div>'
                + '</div>';
            return tpl;
        },
        scope: {
            esColumns: "=",
            esResource: "@",
            esPageSize: "@",
            esTransfer: "&?",
            esOptions: "=?",
            esItemId:"=?",
            esQuery: "=",
            esId: "@",
            esTemplate:"=?"
        },
        controller: ["$scope", function ($scope, $element, $attrs) {
            if (!$scope.esPageSize) {
                $scope.esPageSize = 5;
            }

            var conditions = {
                by: null,
                keyword: null
            };

            var pageCount = 1;

            $scope.pagination = [];
            $scope.pageNum = 1;
            $scope.jump = function (pageNum) {
                $scope.pageNum = pageNum;
                _loadData($scope.esResource, $scope.esPageSize, $scope.pageNum, conditions.by, conditions.keyword, null);
            };

            if (!$scope.esTransfer) {
                $scope.esTransfer = function (rawData) {
                    return function (rawData) {
                        return rawData;
                    };
                }
            }

            $scope.clickBtn = function(){
                $scope.$emit('$btnClick');
            };

            $scope.previous = function () {
                if ($scope.pageNum > 1) {
                    $scope.jump($scope.pageNum - 1);
                }
            };

            $scope.next = function () {
                if ($scope.pageNum < pageCount) {
                    $scope.jump($scope.pageNum + 1);
                }
            }

            $scope.first = function () {
                $scope.jump(1);
            }

            $scope.last = function () {
                $scope.jump(pageCount);
            }


            function _loadData(resource, pageSize, pageNum, filterBy, filterValue, sortBy) {
                $scope.isLoading = true;
                esRequestService.esGet(EasyAssess.activeEnv.pdm() + resource + ($scope.esItemId ? "/"+ $scope.esItemId : ($scope.esResource.indexOf("/list") != -1 ? "" : "/list")) + ($scope.esQuery ? "?" + $scope.esQuery : ""), {
                    size: pageSize,
                    page: pageNum - 1,
                    sortBy: sortBy,
                    filterField: filterBy,
                    filterValue: filterValue
                }).then(function (result) {
                    $scope.isLoading = false;
                    if (result.data.content.length > 0) {
                        $scope.esData = $scope.esTransfer()(result.data.content);
                        $scope.pagination = [];
                        pageCount = result.data.totalPages;
                        if (!pageCount) pageCount = 1;

                        var max = 5;
                        var start = 0;
                        var end = pageCount;
                        if (pageCount > max) {
                            if (($scope.pageNum + max) <= pageCount && ($scope.pageNum - Math.ceil((max / 2)) <= 0)) {
                                start = 0;
                                end = start + max;
                            }
                            else if (($scope.pageNum + max) <= pageCount && ($scope.pageNum - Math.ceil((max / 2)) > 0)) {
                                start = $scope.pageNum - Math.ceil((max / 2));
                                end = start + max;
                            }
                            else {
                                end = pageCount;
                                start = pageCount - max;
                            }
                        }

                        for (var i = start; i < end; i++) {
                            var pageIndex = i + 1;
                            $scope.pagination.push(pageIndex);
                        }
                    } else {
                        $scope.esData = [];
                        $scope.pagination = [];
                    }
                }).then(function (error) {
                    if (error) {
                        $scope.isLoading = false;
                        console.log('fetching data error');
                    }
                });
            }

            $scope.isLoading = true;

            if (!$scope.esId) {
                $scope.esId = "";
            } else {
                $scope.esId = $scope.esId + "_";
            }

            $scope.select = function (rowModel,$event) {
                if($event.target.getAttribute('data-btn') == 1){
                    return false;
                }
                $scope.$emit('$' + $scope.esId + 'selected', rowModel);
            };

            $scope.$on('$onSearch', function (e, condition) {
                conditions = condition;
                $scope.pageNum = 1;
                _loadData($scope.esResource, $scope.esPageSize, $scope.pageNum, conditions.by, conditions.keyword, null);
            });

            $scope.$on('$' + $scope.esId + 'refresh', function () {
                _loadData($scope.esResource, $scope.esPageSize, $scope.pageNum, conditions.by, conditions.keyword, null);
            });

            _loadData($scope.esResource, $scope.esPageSize, $scope.pageNum, null, null, null);
        }]
    };
});


