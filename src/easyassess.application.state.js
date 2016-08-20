var EasyAssess = require('./easyassess.application');

require("./components/assessment");
require("./components/user");
require("./components/template");
require("./components/role");
require("./components/health_ministry");
require("./components/code_group");
require("./components/assessment_new");
require("./components/assessment_detail");
require("./components/assay_code");
require("./components/assay_category");
require("./components/activated_form");
require("./components/closed_form");
require("./components/iqc_template");
require("./components/iqc_plan");
require("./components/iqc_plan_ministry");
require("./components/iqc_plan_ministry_forms");
require("./components/iqc_new");

EasyAssess.app.stateProvider.state('user', {
    url:"/user",
    templateUrl: 'user.html',
    controller:  "userController"
});

EasyAssess.app.stateProvider.state('template', {
    url:"/template",
    templateUrl: 'template.html',
    controller:  "templateController"
});

EasyAssess.app.stateProvider.state('role', {
    url:"/role",
    templateUrl: 'role.html',
    controller:  "roleController"
});

EasyAssess.app.stateProvider.state('health_ministry', {
    url:"/health_ministry",
    templateUrl: 'health_ministry.html',
    controller:  "health_ministryController"
});

EasyAssess.app.stateProvider.state('code_group', {
    url:"/code_group",
    templateUrl: 'code_group.html',
    controller:  "code_groupController"
});

EasyAssess.app.stateProvider.state('cdc', {
    url:"/cdc",
    templateUrl: 'cdc.html',
    controller:  "cdcController"
});

EasyAssess.app.stateProvider.state('assay_code', {
    url:"/assay_code",
    templateUrl: 'assay_code.html',
    controller:  "assay_codeController"
});

EasyAssess.app.stateProvider.state('assay_category', {
    url:"/assay_category",
    templateUrl: 'assay_category.html',
    controller:  "assay_categoryController"
});

EasyAssess.app.stateProvider.state('assessment', {
    url:"/assessment",
    templateUrl: 'assessment.html',
    controller:  "assessmentController",
    data:{detail:{}}
});

EasyAssess.app.stateProvider.state('assessment.detail', {
    url:"/detail/:id",
    templateUrl:  'assessment_detail.html',
    controller: "assessment_detailController"
});

EasyAssess.app.stateProvider.state('assessment.new', {
    url:"/new",
    templateUrl:  'assessment_new.html',
    controller: "assessment_newController"
});

EasyAssess.app.stateProvider.state('activated_form', {
    url:"/activated",
    templateUrl:  'activated_form.html',
    controller: "activated_formController"
});

EasyAssess.app.stateProvider.state('closed_form', {
    url:"/closed",
    templateUrl:  'closed_form.html',
    controller: "closed_formController"
});

EasyAssess.app.stateProvider.state('plan',{
    url:"/plan",
    templateUrl:"iqc_plan.html",
    controller:"iqcplanController",
    data:{detail:{}}
});

EasyAssess.app.stateProvider.state('plan.ministry',{
    url:"/ministry",
    templateUrl:"iqc_plan_ministry.html",
    controller:"iqcplan_ministryController",
    data:{ministry:{}}

});
EasyAssess.app.stateProvider.state('plan.ministry.forms',{
    url:"/forms",
    templateUrl:"iqc_plan_ministry_forms.html",
    controller:"iqcplan_ministryformsController"
});


EasyAssess.app.stateProvider.state('iqc_template',{
    url:"/iqc_template",
    templateUrl:"iqc_template.html",
    controller:"iqc_templateController"
});

EasyAssess.app.stateProvider.state('plan.new',{
    url:"/new",
    templateUrl:"iqc_new.html",
    controller:"iqc_newController"
});





