var EasyAssess = require('../../easyassess.application');

EasyAssess.directives["esAppIqcHistoryGrid"]
    = EasyAssess.app.directive("esAppIqcHistoryGrid", function ($http, esRequestService) {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: function () {
            var tpl = '<div>'
                + '<table class="table table-striped">'
                + '<tr ng-show="isLoading" style="padding:20px 20px 20px 20px;"><td colspan="{{esColumns.length}}"><es-spinner></es-spinner></td></tr>'
                + '<tr ng-hide="isLoading" ng-repeat="plan in esData" style="cursor:pointer;">'
                + '<td>'
                + '<table class="table table-striped"><tr><td></td><td ng-repeat="record in plan.targetRecords"><span>{{record.date}}</span></td></tr>'
                + '<tr><td style="width: 150px;">{{plan.owner.name}} - {{plan.planName}}</td><td ng-repeat="record in plan.targetRecords">'
                + '<table class="table table-striped">'
                +   '<tr ng-repeat="item in record.items">'
                +       '<td>{{item.subject}}</td>'
                +       '<td ng-repeat="specimen in item.specimens">{{specimen.number}}: {{specimen.value}}</td>'
                +   '</tr>'
                + '</table>'
                + '<table class="table table-striped">'
                +           '<tr>'
                +							'<td>记录标签:</td>'
                +							'<td>{{record.tags}}</td>'
                +						'</tr>'
                +   '<tr ng-repeat="(name, value) in record.additionalData">'
                +       '<td>{{name}}</td>'
                +       '<td>{{value}}</td>'
                +   '</tr>'
                +           '<tr>'
                +							'<td>记录创建时间:</td>'
                +							'<td>{{record.createdAt}}</td>'
                +						'</tr>'
                +           '<tr>'
                +							'<td>最后修改时间:</td>'
                +							'<td>{{record.lastModified}}</td>'
                +						'</tr>'
                +           '<tr>'
                +							'<td>批注:</td>'
                +							'<td style="color: red">{{record.comments}}</td>'
                +						'</tr>'
                + '</table>'
                + '</td></tr>'
                + '</table>'
                + '</td>'
                + '</tr>'
                + '</table>'
                + '<div align="center" style="color:darkgray;font-style: italic;" ng-if="esData.length == 0 && !isLoading">没有匹配的记录</div>'
                + '<div ng-show="pagination.length">'
                + '<table><tr><td><ul class="pagination pagination-sm">'
                + '<li><a ng-click="first()" href="javascript:void(0)"><span class="glyphicon glyphicon-backward"></span></a></li>'
                + '<li><a ng-click="previous()" href="javascript:void(0)"><span class="glyphicon glyphicon-chevron-left"></span></a></li>'
                + '<li ng-repeat="n in pagination"><a ng-if="n != pageNum"ng-click="jump(n)" href="javascript:void(0)">{{n}}</a><span ng-if="n == pageNum" style="color:black">{{n}}</span></li>'
                + '<li><a ng-click="next()" href="javascript:void(0)"><span class="glyphicon glyphicon-chevron-right"></span></a></li>'
                + '<li><a ng-click="last()" href="javascript:void(0)"><span class="glyphicon glyphicon-forward"></span></a></li>'
                + '</ul></td>'
                + '<td><div class="pagination form-group" style="padding-left: 50px;"><table><tr><td><span style="float: left;padding:5px 5px 0px 0px;">跳转: </span></td><td><input class="form-control" style="width: 50px;height:30px;" type="tel" min=1 ng-keyup="go(pageNum, $event)" ng-model="pageNum"/></td></tr></table></div></td>'
                + '<td><div class="pagination form-group" style="padding-left: 50px;"><table><tr><td><span style="float: left;padding:5px 5px 0px 0px;">每页显示(行): </span></td><td><select class="form-control" ng-change="setPageSize(esPageSize)" ng-model="esPageSize" style="width: 60px;height:30px;"><option selected="selected" value="5">5</option><option value="10">10</option><option value="20">20</option><option value="50">50</option></select></td></tr></table></div></td>'
                + '</tr></table>'
                + '</div>';
            return tpl;
        },
        scope: {
            esPageSize: "@",
            esTemplateId: "@",
            esData: "=?"
        },
        controller: ["$scope", function ($scope, $element, $attrs) {

            if (!$scope.esPageSize) {
                $scope.esPageSize = "5";
            }

            var pageCount = 1;

            $scope.pagination = [];
            $scope.pageNum = 1;
            $scope.jump = function (pageNum) {
                if (!pageNum || isNaN(pageNum) || pageNum < 1) pageNum = 1;
                if (pageNum > pageCount) pageNum = pageCount;
                $scope.pageNum = pageNum;
                _loadData($scope.esPageSize, $scope.pageNum, null, null, null);
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

            $scope.go = function(pageNumber, e) {
                if (e.key === 'Enter') {
                    $scope.jump(pageNumber);
                }
            }

            $scope.setPageSize = function(size) {
                _loadData($scope.esPageSize, $scope.pageNum, null, null, null);
            }

            function _loadData(pageSize, pageNum, filterBy, filterValue, sortBy) {
                $scope.isLoading = true;
                esRequestService.esGet(EasyAssess.activeEnv.iqc() + "template/" + $scope.esTemplateId + "/record/list", {
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

            _loadData($scope.esPageSize, $scope.pageNum, null, null, null);
        }]
    };
});


