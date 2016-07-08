var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssessmentAnswerController = function($scope,$state,esRequestService) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.AssessmentAnswerController .prototype = EasyAssess.extend({
    initialize: function($scope,$state,esRequestService) {

        $scope.assessment = $state.current.data.detail;





        var url = EasyAssess.activeEnv['assess']() + 'template/' + $scope.assessment.securedAssessment.templateGuid;
        esRequestService.esGet(url).then(function(data){
           $scope.template = data.data;
            console.log($scope.template);
        });

        $scope.helpData = $scope.assessment.securedAssessment.id;


        $scope.answer = {
            values:[]
        };

        $scope.save = function(){
            var url = EasyAssess.activeEnv['assess']() + 'form/values/' + $scope.assessment.id;
            esRequestService.esPut(url,$scope.answer.values).then(function(res){
            });

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