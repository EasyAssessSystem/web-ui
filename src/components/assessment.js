var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssessmentController = function ($scope, esRequestService, $state, ngDialog) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.AssessmentController.prototype = EasyAssess.extend({
    _initialize: function ($scope, esRequestService, $state, ngDialog) {
        $scope.doFinalize = false;
        $scope.fields = [
            {title: "考评名称", field: "name", type: "string", searchable: true, default: true},
            {title: "开始日期", field: "startDate", type: "string", searchable: false, default: false},
            {title: "截止日期", field: "startDate", type: "string", searchable: false, default: false},
            {title: "发起人", field: "ownerName", type: "string", searchable: true, default: false},
            {title: "状态", field: "status", type: "string", searchable: true, default: false},
            {
                title: "操作",
                field: "actions",
                type: "string",
                searchable: false,
                default: false,
                template: true,
                text: "完成考评"
            }
        ];

        this._statusMap = {
            "A": "进行中",
            "F": "已完成"
        };

        $scope.data = [300, 500, 100];
        $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];

        $scope.data2 = [400, 600, 200];
        $scope.labels2 = ["Download Sales2", "In-Store Sales2", "Mail-Order Sales2"];

        $scope.linelabels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.lineseries = ['Series A', 'Series B'];
        $scope.linedata = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];

        $scope.goback = function () {
            $scope.activeModel = null;
            $scope.doFinalize = false;
        };

        $scope.statisticValue = function (row, specimen) {
            var average = [];
            var counts = {
                total: 0
            };
            $scope.finalizingModel.forms.forEach(function (form) {
                if (form.status == "C") {
                    form.values.forEach(function (val) {
                        if (val.subjectGuid == row.guid && val.specimenGuid == specimen.guid) {
                            if (val.valueType == "V") {
                                average.push(Number(val.value));
                            } else {
                                counts.total += 1;
                                if (!counts[val.value]) {
                                    counts[val.value] = 0;
                                }
                                counts[val.value] += 1;
                            }
                        }
                    });
                }
            });

            if (average.length > 0) {
                var total = 0;
                average.forEach(function (val) {
                    total += val;
                });

                average = total / average.length;
                return ["均值:" + average];
            } else if (Object.getOwnPropertyNames(counts).length > 0){
                var percentages = [];
                for (var key in counts) {
                    if (key == "total") continue;
                    percentages.push(key + ":" + (counts[key]/counts.total) * 100 + "%");
                }
                return percentages;
            } else {
                return ["N/A"];
            }
        }

        $scope.$on('$btnClick', function (e, model) {
            ngDialog.openConfirm({
                template: '<div class="ngdialog-message">是否确定要结束这次考评</div>'
                + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">确定</button><button ng-click="closeThisDialog()" class="btn btn-primary">取消</button></div>',
                plain: true
            }).then((function () {
                $scope.template = null;
                $scope.doFinalize = true;
                $scope.finalizingModel = model;
                esRequestService.esGet(EasyAssess.activeEnv.assess() + "template/" + model.templateGuid).then(
                    (function (result) {
                        $scope.template = result.data;
                    }).bind(this)
                );
            }).bind(this));
        });

    },
    _restrict: function () {
    },

    _select: function (model) {
        this.$state.current.data.detail = model;
        EasyAssess.TaskManager.start('assessment.detail', this.$state);
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessmentController", EasyAssess.app.AssessmentController);