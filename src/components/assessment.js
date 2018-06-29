var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssessmentController = function ($scope, esRequestService, $state, ngDialog) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.AssessmentController.prototype = EasyAssess.extend({
    _initialize: function ($scope, esRequestService, $state, ngDialog) {
        $scope.canDelete = this._permission.delete;
        $scope.doFinalize = false;
        $scope.fields = [
            {title: EasyAssess.lang.pages.assessment.assessmentNameText, field: "name", type: "string", searchable: true, default: true},
            {title: EasyAssess.lang.pages.assessment.startDateText, field: "startDate", type: "string", searchable: false, default: false},
            {title: EasyAssess.lang.pages.assessment.endDateText, field: "endDate", type: "string", searchable: false, default: false},
            {title: EasyAssess.lang.pages.assessment.creatorText, field: "ownerName", type: "string", searchable: true, default: false},
            {title: EasyAssess.lang.pages.assessment.statusText, field: "status", type: "string", searchable: true, default: false},
            {
                title: EasyAssess.lang.pages.assessment.actionText,
                template: "assessment_button_column.html",
                clickHandler: (function($index, model, $event) {
                    if ($($event.target).attr('es-id') == 'close') {
                        $scope.template = null;
                        $scope.doFinalize = true;
                        esRequestService.esGet(EasyAssess.activeEnv.assess() + "assessment/" + model.id).then(
                          (function (result) {
                              $scope.finalizingModel = result.data;
                              esRequestService.esGet(EasyAssess.activeEnv.assess() + "template/" + model.templateGuid).then(
                                (function (result) {
                                    $scope.template = result.data;
                                }).bind(this)
                              );
                          }).bind(this)
                        );

                    } else if ($($event.target).attr('es-id') == 'editNotice') {
                        ngDialog.open({
                            template: '<div style="padding: 10px 10px 10px 10px;height: 700px;overflow-y: auto;">'
                              + '<es-form-notice-editor es-assessment-id="' + model.id + '"></es-form-notice-editor>'
                              +  '</div>',
                            plain: true,
                            width: 1000,
                            controller: ['$scope', function ($dialogScope) {

                            }]
                        });
                    } else if ($($event.target).attr('es-id') == 'export') {
                        window.open(EasyAssess.activeEnv.assess() + "assessment/excel/" + model.id)
                    } else if ($($event.target).attr('es-id') == 'reopen') {
                        ngDialog.openConfirm({
                            template:   '<div class="ngdialog-message">' + EasyAssess.lang.pages.assessment.msgConfirmReset + '</div>'
                            + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">' + EasyAssess.lang.pages.assessment.okButtonText + '</button><button ng-click="closeThisDialog()" class="btn btn-primary">' + EasyAssess.lang.pages.assessment.cancelButtonText + '</button></div>',
                            plain: true
                        }).then(
                          (function(){
                              esRequestService.esGet(EasyAssess.activeEnv.assess() + 'assessment/' + model.id + '/reopen')
                                .then((function(){
                                    $scope.$broadcast('$refresh');
                                }).bind(this));
                          }).bind(this)
                        );
                    } else if ($($event.target).attr('es-id') == 'edit') {
                        EasyAssess.TaskManager.start('template.edit', this.$state, null, {id: model.templateGuid});
                    } else {
                        ngDialog.openConfirm({
                            template:   '<div class="ngdialog-message">' + EasyAssess.lang.pages.assessment.msgConfirmDeleteAssessment + '</div>'
                            + '<div align="right"><button ng-click="confirm()" class="btn btn-primary">' + EasyAssess.lang.pages.assessment.okButtonText + '</button><button ng-click="closeThisDialog()" class="btn btn-primary">' + EasyAssess.lang.pages.assessment.cancelButtonText + '</button></div>',
                            plain: true
                        }).then(
                          (function(){
                              esRequestService.esDelete(EasyAssess.activeEnv.assess() + 'assessment/' + model.id)
                                .then((function(){
                                    $scope.$broadcast('$refresh');
                                }).bind(this));
                          }).bind(this)
                        );
                    }
                }).bind(this)
            }
        ];

        this._statusMap = {
            "A": EasyAssess.lang.pages.assessment.statusInprogressText,
            "F": EasyAssess.lang.pages.assessment.statusFinalizedText
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

        $scope.statisticValue = function (row, specimen) {
            var average = [];
            var counts = {
                total: 0
            };
            $scope.finalizingModel.forms.forEach(function (form) {
                if (form.status == "C") {
                    form.values.forEach(function (val) {
                        if (val.subjectGuid == row.guid && val.specimenGuid == specimen.guid) {
                            var valueType = row.optionMap[val.specimenGuid].type;
                            if (valueType == "V" || valueType == "T" || valueType == "G") {
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
                return [EasyAssess.lang.pages.assessment.averageText + ":" + average.toFixed(2)];
            } else if (Object.getOwnPropertyNames(counts).length > 0){
                var percentages = [];
                for (var key in counts) {
                    if (key == "total") continue;
                    percentages.push(key + ":" + ((counts[key]/counts.total) * 100).toFixed(2) + "%");
                }
                return percentages;
            } else {
                return ["N/A"];
            }
        }

        $scope.$on('$wizard_complete', function(e, model){
            esRequestService.esPost(EasyAssess.activeEnv.assess() + "template", $scope.template).then(
                (function(response) {
                    esRequestService.esPost(EasyAssess.activeEnv.assess() + "assessment/finalize/" + $scope.finalizingModel.id).then(
                        (function (result) {
                            $scope.activeModel = null;
                            $scope.doFinalize = false;
                        }).bind(this)
                    );
                }).bind(this)
            );
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