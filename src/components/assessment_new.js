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
            "participants": {},
            "specimenCodes": {}
        };
        $scope.templateFields = [
            {title: "模板", field: "header.name", type: "string", searchable: true, default: true}
        ];
        $scope.emptyModel.startDate = null;
        $scope.emptyModel.endDate = null;
        $scope.hideStart = true;
        $scope.hideEnd = true;
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

        $scope.formatDate = function (date) {
            function pad(n) {
                return n < 10 ? '0' + n : n;
            }
            return date && date.getFullYear()
                + '-' + pad(date.getMonth() + 1)
                + '-' + pad(date.getDate());
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
                if (node.selected) {
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

        $scope.getSetButtonClass = function(specimen) {
            if ($scope.emptyModel.specimenCodes[specimen.number]) {
                return "btn-success";
            }
            return "btn-danger";
        }

        $scope.setSpecimenCodes = function (specimen) {
            ngDialog.open({
                template: '<div class="es-dialog-content">'
                          + '<div>盲样码</div>'
                          + '<div><textarea class="form-control" style="height:300px;padding-bottom: 10px;" ng-model="codes"></textarea></div>'
                          + '<div><button ng-click="submit()" es-ids="btnSubmit" class="btn btn-primary">确定</button></div></div>',
                plain: true,
                controller: ['$scope', function ($dialog) {
                    $dialog.submit = function () {
                        if ($dialog.codes) {
                            var codes = $dialog.codes.indexOf("\r\n") != -1 ? $dialog.codes.split("\r\n") : $dialog.codes.split("\n");
                            $scope.emptyModel.specimenCodes[specimen.number] = codes;
                        }
                        $dialog.closeThisDialog();
                    }
                }]
            });
        };
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("assessment_newController", EasyAssess.app.assessmentNewController);