const express = require('express');
const { getSession } = require('../db.js');
const { q1Aggr, q2Aggr, q3Aggr, q4Aggr, q5Aggr, q6Aggr, q7Aggr, q8Aggr, q9Aggr, q10Aggr } = require('../aggregations/aggregations');

const router = express.Router();

const fetchData = async (req, res, query) => {
    try {
        const session = getSession();
        const result = await session.run(query);
        const records = result.records.map(record => record.toObject());
        res.json(records);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const questionRoutes = [
    { path: '/api/question1', query: q1Aggr },
    { path: '/api/question2', query: q2Aggr },
    { path: '/api/question3', query: q3Aggr },
    { path: '/api/question4', query: q4Aggr },
    { path: '/api/question5', query: q5Aggr },
    { path: '/api/question6', query: q6Aggr },
    { path: '/api/question7', query: q7Aggr },
    { path: '/api/question8', query: q8Aggr },
    { path: '/api/question9', query: q9Aggr },
    { path: '/api/question10', query: q10Aggr }
];

questionRoutes.forEach(route => {
    router.get(route.path, async (req, res) => {
        await fetchData(req, res, route.query);
    });
});

module.exports = router;
