var EasyAssess = require('../easyassess.application');
EasyAssess.app.ClosedFormController = function($scope, esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.ClosedFormController .prototype = EasyAssess.extend({
    _initialize: function($scope) {
        $scope.loading = false;
        $scope.activeModel = null;
        $scope.fields = [
            {title: EasyAssess.lang.pages.assessment.assessmentNameText, field:"formName", type:"string",searchable:true,default:true},
            {title: EasyAssess.lang.pages.assessment.statusText,field:"status",type:"string",searchable:false,default:false},
            {title: EasyAssess.lang.pages.forms.submitDate, field:"submitDate", type:"string",searchable:false,default:false},
            {title: EasyAssess.lang.pages.forms.scoreText, field:"totalScore", type:"number",searchable:false,default:false},
            {title: EasyAssess.lang.pages.forms.attachmentScoreText, field:"additionalScore", type:"number",searchable:false,default:false},
            {title: EasyAssess.lang.pages.forms.totalScoreText, field:"totalScore+additionalScore", type:"number",searchable:false,default:false},
            {title: EasyAssess.lang.pages.forms.assessmentOwnerText, field:"securedAssessment.ownerName", type:"string",searchable:false,default:false},
            {
                title: EasyAssess.lang.pages.forms.actionText,
                template: "form_action_column.html",
                clickHandler: (function ($index, model, $event) {
                    if ($($event.target).attr('es-id') == 'export') {
                        window.open(EasyAssess.activeEnv.assess() + "form/excel/" + model.id)
                    } else {
                        window.open(EasyAssess.activeEnv.assess() + "form/" + model.id + "/certification");
                    }
                }).bind(this)
            }
        ];

        this._statusMap = {
            "A": EasyAssess.lang.pages.assessment.statusUnfilledText,
            "C": EasyAssess.lang.pages.assessment.statusReviewingText,
            "F": EasyAssess.lang.pages.assessment.statusPublishedText
        };
    },

    _postSelect: function(model) {
        this.$scope.loading = true;
        this.esRequestService.esGet(EasyAssess.activeEnv.assess() + "template/" + model.securedAssessment.templateGuid).then(
            (function(result) {
                this.$scope.loading = false;
                this.$scope.template = result.data;
            }).bind(this)
        );
    }
}, EasyAssess.app.MaintenanceController.prototype);

EasyAssess.app.registerController("closed_formController", EasyAssess.app.ClosedFormController);