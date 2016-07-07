var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssessmentAnswerController = function($scope,$state,esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.AssessmentAnswerController .prototype = EasyAssess.extend({
    initialize: function($scope,$state,esRequestService) {

        $scope.assessment = $state.current.data.detail;





        var url = EasyAssess.activeEnv['assess']() + 'template/' + $scope.assessment.templateId;
        esRequestService.esGet(url).then(function(data){
           $scope.template = data.data;
            console.log($scope.template);
        });


        //$scope.template = {
        //    header: {},
        //    groups: []
        //};

        //$scope.data = {
        //    "id": "57753080d4c6cfebf63497a4",
        //    "guid": "88794862-fefdb4fa-5a341cb7fbd0",
        //    "header": {
        //    "name": "testing"
        //},
        //    "groups": [
        //    {
        //        "guid": "48d85c1e-fdd9100e-369b2b9f3c83",
        //        "name": "血液组",
        //        "specimens": [
        //            {
        //                "guid": "3c518d74-db31caa0-a4d8671af4c4",
        //                "number": ""
        //            },
        //            {
        //                "guid": "6c8512fb-c256c814-a64a894ad9eb",
        //                "number": ""
        //            },
        //            {
        //                "guid": "08743025-311051ba-59c1fad47924",
        //                "number": ""
        //            }
        //        ],
        //        "rows": [
        //            {
        //                "guid": "b62d6021-ab360ed3-df3344b7b14a",
        //                "subject": "test1"
        //            },
        //            {
        //                "guid": "0a6a2ae5-a840f30e-d591de989b33",
        //                "subject": "test2"
        //            },
        //            {
        //                "guid": "d54472ac-f2844053-7e8e30d34d91",
        //                "subject": "test3"
        //            }
        //        ]
        //    }
        //],
        //    "formName": "2016西安大考评"
        //};

        //$scope.template.header = $scope.data.header;
        //$scope.template.groups = $scope.data.groups;

        $scope.specimensCodes = [];
        $scope.answer = {
            values:[]
        };

        $scope.save = function(){
            var url = EasyAssess.activeEnv['assess']() + 'form/values/' + $scope.assessment.id;
            esRequestService.esPost(url,$scope.answer.values).then(function(res){
                console.log(res);
            });
            console.log($scope.answer);
            console.log($scope.specimensCodes);

        }

        $scope.$on('removeSpecimen',function(e,data){
            removeFromList(data);
        });

        $scope.$on('valueChanged',function(e,data){
            updateTheValueList(data);
        });


        function updateTheValueList(data){
            var updateCode = $scope.answer.values.find(function(item){
                return (item.subjectGuid === data.subjectGuid) && (item.specimenCode === data.specimenCode);

            });

            if (updateCode){
                updateCode.value = data.value
            }else{
                $scope.answer.values.push(data);
            }

        }



        function removeFromList(data){
            console.log(data);

            $scope.answer.values = $scope.answer.values.filter(function(item){
                return item.specimenCode != data;
            });


        }



    }
}, {});

EasyAssess.app.registerController("assessmentAnswerController", EasyAssess.app.AssessmentAnswerController);