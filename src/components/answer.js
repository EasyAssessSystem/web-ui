var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssessmentAnswerController = function($scope) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.AssessmentAnswerController .prototype = EasyAssess.extend({
    initialize: function($scope) {
        $scope.template = {
            header: {},
            groups: []
        };

        $scope.data = {
            "id": "57753080d4c6cfebf63497a4",
            "guid": "88794862-fefdb4fa-5a341cb7fbd0",
            "header": {
            "name": "2016西安大考评"
        },
            "groups": [
            {
                "guid": "48d85c1e-fdd9100e-369b2b9f3c83",
                "name": "血液组",
                "specimens": [
                    {
                        "guid": "3c518d74-db31caa0-a4d8671af4c4",
                        "number": ""
                    },
                    {
                        "guid": "6c8512fb-c256c814-a64a894ad9eb",
                        "number": ""
                    },
                    {
                        "guid": "08743025-311051ba-59c1fad47924",
                        "number": ""
                    }
                ],
                "rows": [
                    {
                        "guid": "b62d6021-ab360ed3-df3344b7b14a",
                        "subject": "血液检测",
                        "optionMap": {
                            "3c518d74-db31caa0-a4d8671af4c4": {
                                "type": "S",
                                "expectedValues": [
                                    {
                                        "value": "1",
                                        "weight": 1
                                    }
                                ],
                                "optionValues": [
                                    {
                                        "value": "1"
                                    }
                                ]
                            },
                            "6c8512fb-c256c814-a64a894ad9eb": {
                                "type": "V",
                                "expectedValues": [
                                    {
                                        "value": "2",
                                        "weight": 2
                                    }
                                ],
                                "optionValues": []
                            }
                        }
                    },
                    {
                        "guid": "0a6a2ae5-a840f30e-d591de989b33",
                        "subject": "尿液检测",
                        "optionMap": {
                            "3c518d74-db31caa0-a4d8671af4c4": {
                                "type": "S",
                                "expectedValues": [],
                                "optionValues": []
                            }
                        }
                    },
                    {
                        "guid": "d54472ac-f2844053-7e8e30d34d91",
                        "subject": "血型检查",
                        "optionMap": {}
                    }
                ]
            }
        ],
            "formName": "2016西安大考评"
        };

        $scope.template.header = $scope.data.header;
        $scope.template.groups = $scope.data.groups;

        $scope.specimensCodes = [];
        $scope.answer = {
            values:[]
        }


        $scope.save = function(){
            console.log($scope.answer);
            console.log($scope.specimensCodes);

        }

        $scope.$on('fakeCodeChanged',function(e,data){
            updateTheCodeList(data)
        });

        $scope.$on('valueChanged',function(e,data){
            updateTheValueList(data);
        });

        function updateTheCodeList(data){
            console.log(data);
           var updateItem= $scope.specimensCodes.find(function(item){
                return item.guid == data.guid
            });
            if (updateItem){
                updateItem.fakeCode = data.fakeCode
            }else{
                $scope.specimensCodes.push(data);
            }
            console.log($scope.specimensCodes);

        }

        function updateTheValueList(data){

            var switchedData = switchToFakeCode(data);

            var updateCode = $scope.answer.values.find(function(item){
                item.itemId == switchedData.itemId;
                item.sampleId = switchedData.sampleId
            });

            if (updateCode){
                updateCode.value = switchedData.value
            }else{
                $scope.answer.values.push(switchedData);
            }

        }

        function switchToFakeCode(data){
             var dictObj = $scope.specimensCodes.find(function(item){
                 return item.guid == data.sampleId
             });
            data.sampleId = dictObj.fakeCode;

            return data
        }



    }
}, {});

EasyAssess.app.registerController("assessmentAnswerController", EasyAssess.app.AssessmentAnswerController);