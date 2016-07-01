var EasyAssess = require('./easyassess.application');

require("./components/assessment");
require("./components/user");
require("./components/template");
require("./components/role");
require("./components/health_ministry");
require("./components/code_group");
require("./components/cdc");
require("./components/assessment_new");
require("./components/assessment_detail");
require("./components/assay_code");
require("./components/assay_category");
require("./components/myassessment");
require("./components/myassessment_progress");
require("./components/myassessment_done");
require("./components/answer");



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

EasyAssess.app.stateProvider.state('myassessment', {
    url:"/myassessment",
    templateUrl: 'myassessment.html',
    controller:  "myassessmentController"
});

EasyAssess.app.stateProvider.state('myassessment.progress', {
    url:"/progress",
    templateUrl:  'myassessment_progress.html',
    controller: "myassessment_progressController"
});

EasyAssess.app.stateProvider.state('myassessment.done', {
    url:"/done",
    templateUrl:  'myassessment_done.html',
    controller: "myassessment_doneController"
});

EasyAssess.app.stateProvider.state('myassessment.answer', {
    url:"/answer",
    templateUrl:  'answer.html',
    controller: "assessmentAnswerController"
});