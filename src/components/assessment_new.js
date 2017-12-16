var EasyAssess = require('../easyassess.application');
EasyAssess.app.assessmentNewController = function ($scope, $element, ngDialog, esRequestService, $state) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.assessmentNewController.prototype = EasyAssess.extend({
    _initialize: function ($scope, $element, ngDialog, esRequestService, $state) {
        $scope.emptyModel = {
            "id": -1,
            "name": "",
            "templateGuid": "",
            "startDate": "",
            "endDate": "",
            "owner": "",
            "enableCert": false,
            "certContent": "",
            "certCommentLabel": "",
            "certCommentContent": "",
            "certTitle": "",
            "certSubTitle": "",
            "certIssueDate": "",
            "certIssuer": "",
            "participants": {},
            "specimenCodes": {},
            "passScore": 60
        };
        $scope.templateFields = [
            {title: EasyAssess.lang.pages.assessment.templateText, field: "header.name", type: "string", searchable: true, default: true}
        ];
        $scope.emptyModel.startDate = null;
        $scope.emptyModel.endDate = null;
        $scope.hideStart = true;
        $scope.hideEnd = true;
        $scope.hideIssueDate = true;
        $scope.currentMinistryId = EasyAssess.session.currentUser.ministries.length > 0
                                            ? EasyAssess.session.currentUser.ministries[0].id : -1;
        $scope.closeStartPop = function () {
            $scope.hideStart = true;
        };

        $scope.openStart = function () {
            $scope.hideStart = false;
        };

        $scope.openEnd = function () {
            $scope.hideEnd = false;
        };

        $scope.closeEndPop = function () {
            $scope.hideEnd = true;
        };

        $scope.openIssueDate = function () {
            $scope.hideIssueDate = false;
        };

        $scope.closeIssueDate = function () {
            $scope.hideIssueDate = true;
        };

        $scope.formatDate = function (date) {
            function pad(n) {
                return n < 10 ? '0' + n : n;
            }
            return date && date.getFullYear()
                + '-' + pad(date.getMonth() + 1)
                + '-' + pad(date.getDate());
        };

        $scope.getSpecimens = function() {
            var specimenNumberMap = {};
            var results = [];
            function hasAppended(number) {
                if (!specimenNumberMap[number]) {
                    specimenNumberMap[number] = true;
                    return false;
                }
                return true;
            }

            function appendGroupSpecimens (group) {
                 group.specimens.forEach(function(specimen){
                    if (specimen.number.indexOf('+') != -1) {
                       var subNumbers =  specimen.number.split('+');
                        subNumbers.forEach(function (number) {
                           if (!hasAppended(number)) {
                               results.push(number);
                           }
                        });
                    } else {
                        if (!hasAppended(specimen.number)) {
                            results.push(specimen.number);
                        }
                    }
                });
            }

            $scope.selectedTemplate.groups.forEach(function (group) {
                appendGroupSpecimens(group);
            });

            return results;
        }

        $scope.selectRow = function (item, event) {
            if (event.target
                && event.target.type != "checkbox"
                && !$(event.target).hasClass("glyphicon")) {
                item.selected = !item.selected;
                $scope.chooseItem(item);
            }
        };

        $scope.chooseItem = function (item) {
            _updateChild(item);
            $scope.emptyModel.participants = {};
            _updateEmptyModel($scope.list);
        };

        $scope.$on('$templateLookup_selected', function(e, model){
            $scope.selectedTemplate = model;
            $scope.emptyModel.templateGuid = model.id;
        });

        $scope.$on('$wizard_complete', function(e, model){
            esRequestService.esPost(EasyAssess.activeEnv.assess() + "assessment", $scope.emptyModel).then(
                function (response) {
                    EasyAssess.TaskManager.start("assessment", $state);
                }
            );
        });

        $scope.validatePageOne = function() {
            if (!$scope.emptyModel.name
                || !$scope.emptyModel.template
                || !$scope.emptyModel.startDate
                || !$scope.emptyModel.endDate) {
                return EasyAssess.lang.pages.assessment.msgRequireAllFields;
            }

            if ($scope.emptyModel.enableCert) {
                if (!$scope.emptyModel.certTitle
                    || !$scope.emptyModel.certSubTitle
                    || !$scope.emptyModel.certContent
                    || !$scope.emptyModel.certCommentLabel
                    || !$scope.emptyModel.certCommentContent
                    || !$scope.emptyModel.certIssuer) {
                    return EasyAssess.lang.pages.assessment.msgRequireAllCertFieldsError;
                }
                if (isNaN($scope.emptyModel.passScore)
                    || Number($scope.emptyModel.passScore) > 100
                    || Number($scope.emptyModel.passScore) < 1) {
                    return EasyAssess.lang.pages.assessment.msgInvalidScoreError;
                }
            }

            return true;
        }

        $scope.validatePageTwo = function() {
            if (Object.getOwnPropertyNames($scope.emptyModel.participants).length > 0) return true;
            return EasyAssess.lang.pages.assessment.msgRequireParticipantError;
        }

        $scope.validatePageThree = function() {
            if ($('.btn-danger').length > 0) {
                return EasyAssess.lang.pages.assessment.msgRequireSpecimenCodeError;
            }
            return true;
        }

        $scope.previewCert = function () {
            var params = "?preview=true";
            for (var key in $scope.emptyModel) {
                if (key.indexOf("cert") == 0) {
                    params+="&" + key + "=" + $scope.emptyModel[key];
                }
            }
            window.open(EasyAssess.activeEnv.assess() + "assessment/certification" + params);
        }

        function _updateChild(item) {
            if (item.ministries.length > 0) {
                var newState = item.selected;
                angular.forEach(item.ministries, function (eachMinistry) {
                    eachMinistry.selected = newState;
                    _updateChild(eachMinistry);
                })
            }
        }

        function _updateParent(item) {
            if (item.supervisorId > 0) {
                var parentMinistry = _searchParent(item.supervisorId, $scope.list);
                var parentState = false;
                angular.forEach(parentMinistry.ministries, function (eachMinistry) {
                    parentState = eachMinistry || parentMinistry;
                });
                parentMinistry.selected = parentState;
                _updateParent(parentMinistry);
            }
        }

        function _searchParent(id, nodes) {
            var parent;
            angular.forEach(nodes, function (each) {
                if (!parent) {
                    if (each.id == id) {
                        return parent = each;
                    } else {
                        parent = _searchParent(id, each.ministries)
                    }
                } else {
                }
            });
            return parent;
        }

        function _updateEmptyModel(nodes) {
            angular.forEach(nodes, function (node) {
                if (node.selected && node.id != $scope.currentMinistryId) {
                    $scope.emptyModel.participants[node.id] = node.name;
                } else {

                }
                if (node.ministries.length > 0) {
                    _updateEmptyModel(node.ministries)
                }
            })
        }

        $scope.isLoading = true;

        esRequestService.esGet(EasyAssess.activeEnv.pdm() + "ministry/list/affiliated?page=0&size=99").then(
            function (response) {
                $scope.isLoading = false;
                $scope.list = response.data.content;
            }
        );

        $scope.getSetButtonClass = function(number) {
            if ($scope.emptyModel.specimenCodes[number]) {
                return "btn-success";
            }
            return "btn-danger";
        }

        $scope.setSpecimenCodes = function (number) {
            ngDialog.open({
                template: '<div class="es-dialog-content">'
                          + '<div>'
                          + EasyAssess.lang.pages.assessment.doubleSpecimenCodeText + ': <input type="radio" checked name="codeType" ng-click="normalCodeSelected()"/>'
                          + EasyAssess.lang.pages.assessment.singleSpecimenCodeText + ': <input type="radio" name="codeType" ng-click="plainCodeSelected()"/>'
                          + '</div>'
                          + '<div><textarea ng-hide="plainCode" class="form-control" style="height:300px;padding-bottom: 10px;" ng-model="codes"></textarea></div>'
                          + '<div><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">' + EasyAssess.lang.pages.assessment.okButtonText + '</button></div></div>',
                plain: true,
                controller: ['$scope', function ($dialog) {
                    $dialog.plainCode = false;

                    $dialog.normalCodeSelected = function () {
                        $dialog.plainCode = false;
                        if ($dialog.codes === number) {
                            $dialog.codes = "";
                        }
                    };

                    $dialog.plainCodeSelected = function () {
                        $dialog.plainCode = true;
                        $dialog.codes=number;
                    };

                    $dialog.submit = function () {
                        if ($dialog.codes) {
                            var codes = $dialog.codes.indexOf("\r\n") != -1 ? $dialog.codes.split("\r\n") : $dialog.codes.split("\n");
                            $scope.emptyModel.specimenCodes[number] = codes;
                        }
                        $dialog.closeThisDialog();
                    }
                }]
            });
        };
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessment_newController", EasyAssess.app.assessmentNewController);