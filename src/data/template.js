var template = {
    "guid": "ef7e4660-6c22c828-33a3989c17fc",
    "formName": "2016_01_001",
    "header": {
        "name": "2016年第一季度室间质量考评"
    },
    "groups": [
        {
            "guid": "281c3af8-c395dc6e-d4ce68400ff5",
            "name": "血液检测",
            "specimens": [
                {
                    "guid": "940a4373-44c17125-1a092ccf1cd5",
                    "number": "20160101"
                },
                {
                    "guid": "ca3b785a-edcc6a41-485b3ad84266",
                    "number": "20160102"
                },
                {
                    "guid": "458951e6-583ecd82-847cfc304997",
                    "number": "20160103"
                },
                {
                    "guid": "16431c1c-360a465f-6f8ff065a1fa",
                    "number": "20160104"
                },
                {
                    "guid": "7d7e170f-02b5c6ff-3e8986257eed",
                    "number": "20160105"
                }
            ],
            "codes": [
                {
                    "guid": "800249ea-04825e84-bb3be9ec096c",
                    "name": "方法",
                    "model": "method"
                },
                {
                    "guid": "3827ac35-09b9ddd3-59a58c4a3ad4",
                    "name": "仪器",
                    "model": "instrument"
                },
                {
                    "guid": "3ed0792c-e69e7c9b-7528223a3613",
                    "name": "试剂",
                    "model": "agentia"
                },
                {
                    "guid": "a4d473e5-81a64cb3-7b5b152d5bb2",
                    "name": "校准物",
                    "model": "calibrator"
                }
            ],
            "rows": [
                {
                    "guid": "9576f668-79dfc614-c2818814e5ad",
                    "item": {
                        "name": "血型检测",
                        "unit": "mEq/L"
                    },
                    "optionMap": {
                        "940a4373-44c17125-1a092ccf1cd5": {
                            "type": "S",
                            "expectedValues": [
                                {
                                    "value": "O",
                                    "weight": 100
                                }
                            ],
                            "optionValues": [
                                {
                                    "value": "A"
                                },
                                {
                                    "value": "B"
                                },
                                {
                                    "value": "O"
                                },
                                {
                                    "value": "AB"
                                }
                            ]
                        },
                        "ca3b785a-edcc6a41-485b3ad84266": {
                            "type": "S",
                            "expectedValues": [
                                {
                                    "value": "AB",
                                    "weight": 100
                                }
                            ],
                            "optionValues": [
                                {
                                    "value": "A"
                                },
                                {
                                    "value": "B"
                                },
                                {
                                    "value": "O"
                                },
                                {
                                    "value": "AB"
                                }
                            ]
                        },
                        "458951e6-583ecd82-847cfc304997": {
                            "type": "S",
                            "expectedValues": [
                                {
                                    "value": "AB",
                                    "weight": 100
                                }
                            ],
                            "optionValues": [
                                {
                                    "value": "A"
                                },
                                {
                                    "value": "B"
                                },
                                {
                                    "value": "O"
                                },
                                {
                                    "value": "AB"
                                }
                            ]
                        },
                        "16431c1c-360a465f-6f8ff065a1fa": {
                            "type": "S",
                            "expectedValues": [
                                {
                                    "value": "A",
                                    "weight": 100
                                }
                            ],
                            "optionValues": [
                                {
                                    "value": "A"
                                },
                                {
                                    "value": "B"
                                },
                                {
                                    "value": "O"
                                },
                                {
                                    "value": "AB"
                                }
                            ]
                        },
                        "7d7e170f-02b5c6ff-3e8986257eed": {
                            "type": "S",
                            "expectedValues": [
                                {
                                    "value": "B",
                                    "weight": 100
                                }
                            ],
                            "optionValues": [
                                {
                                    "value": "A"
                                },
                                {
                                    "value": "B"
                                },
                                {
                                    "value": "O"
                                },
                                {
                                    "value": "AB"
                                }
                            ]
                        }
                    }
                },
                {
                    "guid": "fc50e8ba-08363c9c-a0501386e5f8",
                    "item": {
                        "name": "三油甘脂",
                        "unit": "μmol/L"
                    },
                    "optionMap": {
                        "940a4373-44c17125-1a092ccf1cd5": {
                            "type": "V",
                            "expectedValues": [
                                {
                                    "value": "[10,15]",
                                    "weight": 100
                                },
                                {
                                    "value": "[6,9.5]",
                                    "weight": 80
                                },
                                {
                                    "value": "[15.5,17.5]",
                                    "weight": 50
                                }
                            ],
                            "optionValues": []
                        }
                    }
                }
            ]
        }
    ]
}

module.exports = template;