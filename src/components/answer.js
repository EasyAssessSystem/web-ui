var EasyAssess = require('../easyassess.application');
EasyAssess.app.AssessmentAnswerController = function($scope) {
    this.initialize.apply(this, arguments);
};

EasyAssess.app.AssessmentAnswerController .prototype = EasyAssess.extend({
    initialize: function($scope) {
        $scope.answer = {
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
                        "number": "2014034"
                    },
                    {
                        "guid": "6c8512fb-c256c814-a64a894ad9eb",
                        "number": "210343223"
                    },
                    {
                        "guid": "08743025-311051ba-59c1fad47924",
                        "number": "2015634"
                    }
                ],
                "rows": [
                    {
                        "guid": "b62d6021-ab360ed3-df3344b7b14a",
                        "subject": null,
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
                        "subject": null,
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
                        "subject": null,
                        "optionMap": {}
                    }
                ]
            }
        ],
            "formName": "2016西安大考评"
        };

        $scope.answer.header = $scope.data.header;
        $scope.answer.groups = $scope.data.groups;


    }
}, {});

EasyAssess.app.registerController("assessmentAnswerController", EasyAssess.app.AssessmentAnswerController);