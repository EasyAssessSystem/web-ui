var EasyAssess = require('../easyassess.application');
EasyAssess.app.ActivatedFormController = function($scope,$state,esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.ActivatedFormController .prototype = EasyAssess.extend({
    _initialize: function($scope,$state) {
        $scope.fields = [
            {title: EasyAssess.lang.pages.assessment.assessmentNameText, field:"formName", type:"string",searchable:true,default:true},
            {title: EasyAssess.lang.pages.assessment.statusText,field:"status",type:"string",searchable:false,default:false},
            {title: EasyAssess.lang.pages.assessment.startDateText,field:"securedAssessment.startDate",searchable:false,default:false},
            {title: EasyAssess.lang.pages.assessment.endDateText,field:"securedAssessment.endDate",searchable:false,default:false},
            {title: EasyAssess.lang.pages.forms.assessmentOwnerText, field:"securedAssessment.ownerName", type:"string",searchable:false,default:false}
        ];

        this._statusMap = {
            "A": EasyAssess.lang.pages.assessment.statusUnfilledText,
            "S": EasyAssess.lang.pages.assessment.statusDraftText,
            "C": EasyAssess.lang.pages.assessment.statusReviewingText,
            "F": EasyAssess.lang.pages.assessment.statusPublishedText
        };

        $scope.$on('submitted',function(){
            $scope.back();
        });

        $scope.back = function () {
            $scope.activeModel = null;
            $scope.template = null;
        }
    },

    _select: function(model) {
        this.$scope.template = null;
        if (model.status == "A") {
            this.$scope.activeModel = model;
        } else if (model.status == "C") {
            var url = EasyAssess.activeEnv['assess']() + 'template/' + model.securedAssessment.templateGuid;
            this.esRequestService.esGet(url).then((function(data){
                for (var code in model.securedAssessment.specimenCodes) {
                    data.data.groups.forEach(function (group) {
                        group.specimens.forEach(function (specimen) {
                            if (specimen.number === code) {
                                specimen.isPlainNumber = true;
                            }
                        });
                    })
                }
                this.$scope.activeModel = model;
                this.$scope.template = data.data;
            }).bind(this));
        }
    },
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("activated_formController", EasyAssess.app.ActivatedFormController);