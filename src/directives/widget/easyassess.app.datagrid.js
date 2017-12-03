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
                + '<tr ng-hide="isLoading" ng-repeat="rec in esData" style="cursor:pointer;">'
                + '<td ng-repeat="column in esColumns" ng-click="column.clickHandler ? column.clickHandler($index, getRecordModel(rec), $event) : select($index, getRecordModel(rec), $event)"><div ng-if="column.template" ng-include="column.template"></div><span ng-if="!column.template" ng-bind="getColumnContent(rec, column)"></span></td>'
                + '</tr>'
                + '</table>'
                + '<div align="center" style="color:darkgray;font-style: italic;" ng-if="esData.length == 0 && !isLoading">' + EasyAssess.lang.widgets.datagrid.noRecordsText + '</div>'
                + '<div ng-show="pagination.length">'
                + '<table><tr><td><ul class="pagination pagination-sm">'
                + '<li><a ng-click="first()" href="javascript:void(0)"><span class="glyphicon glyphicon-backward"></span></a></li>'
                + '<li><a ng-click="previous()" href="javascript:void(0)"><span class="glyphicon glyphicon-chevron-left"></span></a></li>'
                + '<li ng-repeat="n in pagination"><a ng-if="n != pageNum"ng-click="jump(n)" href="javascript:void(0)">{{n}}</a><span ng-if="n == pageNum" style="color:black">{{n}}</span></li>'
                + '<li><a ng-click="next()" href="javascript:void(0)"><span class="glyphicon glyphicon-chevron-right"></span></a></li>'
                + '<li><a ng-click="last()" href="javascript:void(0)"><span class="glyphicon glyphicon-forward"></span></a></li>'
                + '</ul></td>'
                + '<td><div class="pagination form-group" style="padding-left: 50px;"><table><tr><td><span style="float: left;padding:5px 5px 0px 0px;">' + EasyAssess.lang.widgets.datagrid.goToText + ': </span></td><td><input class="form-control" style="width: 50px;height:30px;" type="tel" min=1 ng-keyup="go(pageNum, $event)" ng-model="pageNum"/></td></tr></table></div></td>'
                + '<td><div class="pagination form-group" style="padding-left: 50px;"><table><tr><td><span style="float: left;padding:5px 5px 0px 0px;">' + EasyAssess.lang.widgets.datagrid.pageSizeText + ': </span></td><td><select class="form-control" ng-change="setPageSize(esPageSize)" ng-model="esPageSize" style="width: 60px;height:30px;"><option selected="selected" value="5">5</option><option value="10">10</option><option value="20">20</option><option value="50">50</option></select></td></tr></table></div></td>'
                + '</tr></table>'
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
            esQuery: "@",
            esId: "@",
            esService:"@",
            esFormatters: "=?"
        },
        controller: ["$scope", function ($scope, $element, $attrs) {
            $scope.parent = $scope.$parent;
            $scope.lang = EasyAssess.lang;
            if (!$scope.esPageSize) {
                $scope.esPageSize = "5";
            }

            if ($scope.esFormatters) {
                $scope.esFormatters = {};
            }

            if (!$scope.esService) {
                $scope.esService = "pdm";
            }

            var conditions = {
                by: null,
                keyword: null
            };

            $scope.getColumnContent = function (row, column) {
                if (column.field.indexOf("+") != -1) {
                    var result = column.type == "number" ? 0 : "";
                    column.field.split("+").forEach(function (v) {
                        column.type == "number" ? result+=row[v] : result+=Number(row[v]);
                    });
                    return result;
                } else if (column.field.indexOf(".") != -1){
                    var result = row;
                    column.field.split(".").forEach(function (v) {
                        if (v && v.indexOf("[0]") == -1) {
                            result=result[v];
                        } else if (v) {
                            eval ('result=result.' + v);
                        }
                    });
                    return result;
                } else {
                    return row[column.field];
                }
            };
            
            var pageCount = 1;

            $scope.pagination = [];
            $scope.pageNum = 1;
            $scope.jump = function (pageNum) {
                if (!pageNum || isNaN(pageNum) || pageNum < 1) pageNum = 1;
                if (pageNum > pageCount) pageNum = pageCount;
                $scope.pageNum = pageNum;
                $scope.$emit('$' + $scope.esId + 'preLookup', conditions);
                _loadData($scope.esResource, $scope.esPageSize, $scope.pageNum, conditions.by, conditions.keyword, null);
            };

            if (!$scope.esTransfer) {
                $scope.esTransfer = function (rawData) {
                    return function (rawData) {
                        return rawData;
                    };
                }
            }

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

            $scope.go = function(pageNumber, e) {
                if (e.key === 'Enter') {
                    $scope.jump(pageNumber);
                }
            }

            $scope.setPageSize = function(size) {
                $scope.$emit('$' + $scope.esId + 'preLookup', conditions);
                _loadData($scope.esResource, size, $scope.pageNum, conditions.by, conditions.keyword, null);
            }

            $scope.getRecordModel = function(rec) {
                return $scope.originalData[rec.index];
            }

            function _loadData(resource, pageSize, pageNum, filterBy, filterValue, sortBy) {
                $scope.isLoading = true;
                esRequestService.esGet(EasyAssess.activeEnv[$scope.esService]() + resource + ($scope.esItemId ? "/"+ $scope.esItemId : ($scope.esResource.indexOf("/list") != -1 ? "" : "/list")) + ($scope.esQuery ? "?" + $scope.esQuery : ""), {
                    size: pageSize,
                    page: pageNum - 1,
                    sortBy: sortBy,
                    filterField: filterBy,
                    filterValue: filterValue
                }).then(function (result) {
                    $scope.isLoading = false;
                    if (result.data.content.length > 0) {
                        $scope.esData = angular.copy(result.data, {}).content;
                        $scope.esData.forEach(function(rec, index) {
                            rec.index = index;
                        });
                        $scope.originalData =  result.data.content;
                        $scope.$emit('$' + $scope.esId + 'postLookup', $scope.esData);
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
                    }
                });
            }

            $scope.isLoading = true;

            if (!$scope.esId) {
                $scope.esId = "";
            } else {
                $scope.esId = $scope.esId + "_";
            }

            $scope.select = function ($index, rowModel, $event) {
                $scope.$emit('$' + $scope.esId + 'selected', rowModel);
            };

            $scope.$on('$onSearch', function (e, condition) {
                conditions = condition;
                $scope.pageNum = 1;
                $scope.$emit('$' + $scope.esId + 'preLookup', conditions);
                _loadData($scope.esResource, $scope.esPageSize, $scope.pageNum, conditions.by, conditions.keyword, null);
            });

            $scope.$on('$' + $scope.esId + 'refresh', function () {
                $scope.$emit('$' + $scope.esId + 'preLookup', conditions);
                _loadData($scope.esResource, $scope.esPageSize, $scope.pageNum, conditions.by, conditions.keyword, null);
            });

            _loadData($scope.esResource, $scope.esPageSize, $scope.pageNum, null, null, null);
        }]
    };
});


