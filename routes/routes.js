const express = require('express');
const {getCollection} = require('../db');
const {q1Aggr, q2Aggr, q3Aggr, q4Aggr, q5Aggr, 
    q6Aggr, q7Aggr, q8Aggr, q9Aggr, q10Aggr} = require('../aggregations/aggregations');
const router = express.Router();

const fetchData = async (req, res, aggregation) => {
    try {
        const collection = getCollection();
        const documents = await collection.aggregate(aggregation).toArray();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({error: 'Internal server error'});
    }
};
const questionRoutes = [
    { path: '/api/question1', aggregation: q1Aggr },
    { path: '/api/question2', aggregation: q2Aggr },
    { path: '/api/question3', aggregation: q3Aggr },
    { path: '/api/question4', aggregation: q4Aggr },
    { path: '/api/question5', aggregation: q5Aggr },
    { path: '/api/question6', aggregation: q6Aggr },
    { path: '/api/question7', aggregation: q7Aggr },
    { path: '/api/question8', aggregation: q8Aggr },
    { path: '/api/question9', aggregation: q9Aggr },
    { path: '/api/question10', aggregation: q10Aggr }
];

questionRoutes.forEach(route => {
    router.get(route.path, async (req, res) => {
        await fetchData(req, res, route.aggregation);
    });
});

module.exports = router;
