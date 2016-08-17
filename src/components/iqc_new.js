var EasyAssess = require('../easyassess.application');
EasyAssess.app.PlanNewController = function ($scope, $element, ngDialog, esRequestService, $state) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.PlanNewController.prototype = EasyAssess.extend({
    _initialize: function ($scope, $element, ngDialog, esRequestService, $state) {
        $scope.emptyModel = {
            "id": -1,
            "name": "",
            "templateGuid": "",
            "duration": 1,
            "owner": "",
            "participants": {},
        };
        $scope.templateFields = [
            {title: "模板", field: "header.name", type: "string", searchable: true, default: true}
        ];

        $scope.currentMinistryId = EasyAssess.session.currentUser.ministries.length > 0
            ? EasyAssess.session.currentUser.ministries[0].id : -1;


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
            esRequestService.esPost(EasyAssess.activeEnv.iqc() + "plan", $scope.emptyModel).then(
                function (response) {
                    EasyAssess.TaskManager.start("plan", $state);
                }
            );
        });

        $scope.validatePageOne = function() {
            if (!$scope.emptyModel.name || !$scope.emptyModel.template) {
                return "所有字段必须填写";
            }
            return true;
        }

        $scope.validatePageTwo = function() {
            if (Object.getOwnPropertyNames($scope.emptyModel.participants).length > 0) return true;
            return "至少选择一个参与单位";
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
        
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("iqc_newController", EasyAssess.app.PlanNewController);