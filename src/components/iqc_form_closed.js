var EasyAssess = require('../easyassess.application');
EasyAssess.app.IqcClosedFormController = function($scope,$state, esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.IqcClosedFormController .prototype = EasyAssess.extend({
    _initialize: function($scope, $state) {
        var formAll = $state.current.data.result;

        $scope.form = {
            values:_proccessValueData(formAll['values']),
            codes:formAll['codes'],
            formName:formAll['formName']
        };

        $scope.template = formAll.plan.template;

        function _proccessValueData(rawValues){
            return rawValues.map(function(eachValue){
                eachValue.specimenGuid = eachValue.specimenCode;
                return eachValue
            });
        }
    }

}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("closed_iqcformController", EasyAssess.app.IqcClosedFormController);