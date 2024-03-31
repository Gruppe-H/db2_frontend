const q1Aggr = [
    {
        $group: {
            _id: "$Organisation Number",
            AvgCityPopulation: {
                $avg: "$City Population"
            },
            AvgTotalEmissions: {
                $avg: "$Total emissions (metric tonnes CO2e)"
            },
            count: {
                $sum: 1
            }
        }
    },
    {
        $match: {
            AvgCityPopulation: {
                $exists: true,
                $ne: null
            },
            AvgTotalEmissions: {
                $exists: true,
                $ne: null
            },
            count: {
                $gt: 1
            }
        }
    },
    {
        $group: {
            _id: null,
            sumCityPopulationTotalEmissions: {
                $sum: {
                    $multiply: [
                        "$AvgCityPopulation",
                        "$AvgTotalEmissions"
                    ]
                }
            },
            sumCityPopulation: {
                $sum: "$AvgCityPopulation"
            },
            sumTotalEmissions: {
                $sum: "$AvgTotalEmissions"
            },
            sumCityPopulation2: {
                $sum: {
                    $pow: ["$AvgCityPopulation", 2]
                }
            },
            sumTotalEmissions2: {
                $sum: {
                    $pow: ["$AvgTotalEmissions", 2]
                }
            },
            n: {
                $sum: 1
            }
        }
    },
    {
        $project: {
            _id: 0,
            correlationCoeffecient: {
                $cond: {
                    if : {
                        $eq: ["$n", 0]
                    },
                    then: null,
                    else: {
                        $divide: [
                            {
                                $subtract: [
                                    {
                                        $multiply: [
                                            "$n",
                                            "$sumCityPopulationTotalEmissions"
                                        ]
                                    },
                                    {
                                        $multiply: [
                                            "$sumCityPopulation",
                                            "$sumTotalEmissions"
                                        ]
                                    }
                                ]
                            },
                            {
                                $sqrt: {
                                    $multiply: [
                                        {
                                            $subtract: [
                                                {
                                                    $multiply: [
                                                        "$n",
                                                        "$sumCityPopulation2"
                                                    ]
                                                },
                                                {
                                                    $pow: [
                                                        "$sumCityPopulation",
                                                        2
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            $subtract: [
                                                {
                                                    $multiply: [
                                                        "$n",
                                                        "$sumTotalEmissions2"
                                                    ]
                                                },
                                                {
                                                    $pow: [
                                                        "$sumTotalEmissions",
                                                        2
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        }
    },
];

const q2Aggr = [
    {
        $match: {
            "Total emissions (metric tonnes CO2e)": {$ne: null},
            "Reporting Year": {$in: [2016, 2017]}
        }
    },
    {
        $group: {
            _id: {
                OrganisationNumber: "$Organisation Number",
                ReportingYear: "$Reporting Year"
            },
            TotalEmissions: {
                $sum: "$Total emissions (metric tonnes CO2e)"
            }
        }
    },
    {
        $group: {
            _id: "$_id.OrganisationNumber",
            emissions2016: {
                $max: {
                    $cond: [
                        {$eq: ["$_id.ReportingYear", 2016]},
                        "$TotalEmissions",
                        null
                    ]
                }
            },
            emissions2017: {
                $max: {
                    $cond: [
                        {$eq: ["$_id.ReportingYear", 2017]},
                        "$TotalEmissions",
                        null
                    ]
                }
            }
        }
    },
    {
        $project: {
            _id: 1,
            emissions2016: 1,
            emissions2017: 1,
            change: {
                $cond: {
                    if : {
                        $and: [
                            {$ne: ["$emissions2016", null]},
                            {$ne: ["$emissions2017", null]}
                        ]
                    },
                    then: {
                        $cond: {
                            if : {$gt: ["$emissions2016", "$emissions2017"]},
                            then: "Decrease",
                            else: "Increase"
                        }
                    },
                    else: null
                }
            }
        }
    },
];

const q3Aggr = [
    {
        $match: {
            "Reporting Year": {$in: [2016, 2017]},
            "Percentage reduction target": {
                $exists: true
            }
        }
    },
    {
        $group: {
            _id: {
                OrganisationNumber:
                        "$Organisation Number",
                ReportingYear: "$Reporting Year"
            },
            PercentageReductionTarget: {
                $avg: "$Percentage reduction target"
            }
        }
    },
    {
        $group: {
            _id: "$_id.OrganisationNumber",
            reductionTarget2016: {
                $max: {
                    $cond: [
                        {$eq: ["$_id.ReportingYear", 2016]},
                        "$PercentageReductionTarget",
                        null
                    ]
                }
            },
            reductionTarget2017: {
                $max: {
                    $cond: [
                        {$eq: ["$_id.ReportingYear", 2017]},
                        "$PercentageReductionTarget",
                        null
                    ]
                }
            }
        }
    },
    {
        $project: {
            _id: 1,
            reductionTarget2016: 1,
            reductionTarget2017: 1,
            change: {
                $cond: {
                    if : {
                        $and: [
                            {
                                $ne: [
                                    "$reductionTarget2016",
                                    null
                                ]
                            },
                            {
                                $ne: [
                                    "$reductionTarget2017",
                                    null
                                ]
                            }
                        ]
                    },
                    then: {
                        $subtract: [
                            "$reductionTarget2017",
                            "$reductionTarget2016"
                        ]
                    },
                    else: null
                }
            }
        }
    }
];

const q4Aggr = [
    {
        $match: {
            "Percentage reduction target": {$exists: true},
            $or: [
                {"C40 City": {$exists: true}},
                {"GCoM City": {$exists: true}}
            ]
        }
    },
    {
        $group: {
            _id: {
                OrganisationNumber: "$Organisation Number",
                C40City: {$ifNull: ["$C40 City", false]},
                GCoMCity: {$ifNull: ["$GCoM City", false]}
            },
            PercentageReductionTargetSum: {$sum: "$Percentage reduction target"}
        }
    },
    {
        $group: {
            _id: {
                C40City: "$_id.C40City",
                GCoMCity: "$_id.GCoMCity"
            },
            avgPercentageReductionTarget: {$avg: "$PercentageReductionTargetSum"}
        }
    },
    {
        $project: {
            _id: 0,
            C40City: "$_id.C40City",
            GCoMCity: "$_id.GCoMCity",
            avgPercentageReductionTarget: 1
        }
    }
];

const q5Aggr = [
    {
        $match: {
            "Percentage reduction target": {$exists: true},
            $or: [
                {"Region": {$exists: true}},
                {"CDP Region": {$exists: true}}
            ]
        }
    },
    {
        $group: {
            _id: {
                OrganisationNumber: "$Organisation Number",
                Region: {$ifNull: ["$Region", "$CDP Region"]}
            },
            PercentageReductionTargetSum: {$sum: "$Percentage reduction target"}
        }
    },
    {
        $group: {
            _id: "$_id.Region",
            avgPercentageReductionTarget: {$avg: "$PercentageReductionTargetSum"}
        }
    },
    {
        $project: {
            _id: 1,
            avgPercentageReductionTarget: 1
        }
    }
];

const q6Aggr = [
    {
        $match: {
            "Percentage reduction target": {$exists: true}
        }
    },
    {
        $group: {
            _id: {
                OrganisationNumber: "$Organisation Number",
                Organisation: "$Organisation",
                City: "$City"
            },
            PercentageReductionTargetSum: {$sum: "$Percentage reduction target"}
        }
    },
    {
        $sort: {"PercentageReductionTargetSum": -1}
    },
    {
        $limit: 1
    },
    {
        $project: {
            _id: 0,
            OrganisationNumber: "$_id.OrganisationNumber",
            Organisation: "$_id.Organisation",
            City: "$_id.City",
            PercentageReductionTargetSum: 1
        }
    }
];

const q7Aggr = [
    {
        $match: {
            Country: {$exists: true},
            City: {$exists: true}
        }
    },
    {
        $group: {
            _id: {
                Country: "$Country",
                City: "$City"
            }
        }
    },
    {
        $group: {
            _id: "$_id.Country",
            cityCount: {$sum: 1}
        }
    }
];

const q8Aggr = [
    {
        $match: {
            "Country": {$exists: true}
        }
    },
    {
        $group: {
            _id: "$Country"
        }
    },
    {
        $group: {
            _id: null,
            count: {$sum: 1}
        }
    }
];

const q9Aggr = [
    {
        $group: {
            _id: {
                baseEmissionsMissing: {
                    $not: {
                        $gt: [
                            "$Total emissions (metric tonnes CO2e)",
                            null
                        ]
                    }
                },
                PercentageReductionTarget:
                        "$Percentage reduction target"
            }
        }
    },
    {
        $match: {
            "_id.baseEmissionsMissing": true
        }
    },
    {
        $group: {
            _id: null,
            count: {$sum: 1}
        }
    }
];

const q10Aggr = [
    {
        $match: {
            Sector: {
                $exists: true
            }
        }
    },
    {
        $group: {
            _id: "$Sector",
            count: {
                $sum: 1
            }
        }
    },
    {
        $sort: {
            count: -1
        }
    }
];

module.exports = {q1Aggr, q2Aggr, q3Aggr, q4Aggr,
    q5Aggr, q6Aggr, q7Aggr, q8Aggr, q9Aggr, q10Aggr};