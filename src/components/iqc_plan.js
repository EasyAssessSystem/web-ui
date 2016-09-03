var EasyAssess = require('../easyassess.application');
EasyAssess.app.IQCPlanController = function ($scope, esRequestService, $state, ngDialog) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IQCPlanController.prototype = EasyAssess.extend({
    _initialize: function ($scope, esRequestService, $state, ngDialog) {
        $scope.resource = "plan";
        this._service = EasyAssess.activeEnv.iqc();
        $scope.emptyModel = {
            "id": -1,
            "name": "",
            "duration": 1,
            "owner": "",
            "participants": {},
            "template":{
                "header":{"name":""}
            }
        };
        $scope.duration= '1';
        $scope.fields = [
            {title: "质控名称", field: "name", type: "string", searchable: true, default: true},
            {title: "发起人", field: "ownerName", type: "string", searchable: true, default: false}
        ];

        $scope.templateFields = [
            {title: "模板", field: "header.name", type: "string", searchable: true, default: true}
        ];

        $scope.validations = {
            name: {
                validateMethod: function (value) {
                    return value && value.length > 0;
                },
                validateResult: true,
                errorMessage: "名称不能为空"
            },
            template: {
                validateMethod: function (value) {
                    return value && value.length > 0;
                },
                validateResult: true,
                errorMessage: "模版不能为空"
            },
            duration: {
                validateMethod: function (value) {
                    return Number(value) > 0;
                },
                validateResult: true,
                errorMessage: "周期必须为大于0的整数"
            }
        }

        $scope.showHistory = function(ministry){
            $scope.list = [];
            $state.current.data.details = {
                ministry: ministry.id,
                plan: $scope.activeModel.id
            };
            EasyAssess.TaskManager.start('plan.forms', $state)
        }

        $scope.$on('$es-validated-changed',function(){
            $scope.validateFinalResult = $scope.validations.name.validateResult;
            $scope.$apply();
        });

        $scope.$on('$templateLookup_selected', function(e, model){
            $scope.activeModel.template = model;
        });

        $scope.chooseItem = function (item) {
            _updateChild(item);
            $scope.activeModel.participants = {};
            _updateActiveModel($scope.list);
        };

        function _updateChild(item) {
            if (item.ministries.length > 0) {
                var newState = item.selected;
                angular.forEach(item.ministries, function (eachMinistry) {
                    eachMinistry.selected = newState;
                    _updateChild(eachMinistry);
                })
            }
        }

        function _updateActiveModel(nodes) {
            angular.forEach(nodes, function (node) {
                if (node.selected) {
                    $scope.activeModel.participants[node.id] = node.name;
                }
                if (node.ministries.length > 0) {
                    _updateActiveModel(node.ministries)
                }
            })
        }
    },

    _createMinistryTree: function(){
        var self = this;
        this.$scope.list = [];
        this.esRequestService.esGet(EasyAssess.activeEnv.pdm() + "ministry/list/affiliated?page=0&size=99").then(
          (function (response) {
              this.$scope.isLoading = false;
              this.$scope.list = response.data.content;
              function _proceedSelections(items) {
                  items.forEach(function(item){
                      if (self.$scope.activeModel.participants[item.id]) {
                          item.selected = true;
                      }
                      if (item.ministries.length > 0) {
                          _proceedSelections(item.ministries);
                      }
                  });
              }

              _proceedSelections(this.$scope.list);
          }).bind(this)
        );
    },

    _postSelect: function (model) {
        var self = this;
        if (this._permission.delete) {
            $('.es-maint-button-group button[ng-click="delete()"]').show();
        }

        this.$scope.ministries = [];

        angular.forEach(this.$scope.activeModel.participants, function(value, key){
            var ministry = {
                "id": key,
                "name": value
            };
            self.$scope.ministries.push(ministry);
        });

        this._createMinistryTree();
    },

    _postAdd: function() {
        this.$scope.ministries = [];
        this._createMinistryTree();
        $('.es-maint-button-group button[ng-click="delete()"]').hide();
    },
}, EasyAssess.app.MaintenanceController.prototype);
EasyAssess.app.registerController("iqcplanController", EasyAssess.app.IQCPlanController);