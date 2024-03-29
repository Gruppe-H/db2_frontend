const express = require('express');
const {getCollection} = require('../db');
const {q1Aggr, q2Aggr, q3Aggr, q4Aggr, q5Aggr, q6Aggr, q8Aggr, q9Aggr} = require('../aggregations/aggregations')
const router = express.Router();

router.get('/api/question1', async (req, res) => {
    try {
        const collection = getCollection();
        const documents = await collection.aggregate(q1Aggr).toArray();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.get('/api/question2', async (req, res) => {
    try {
        const collection = getCollection();
        const documents = await collection.aggregate(q2Aggr).toArray();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.get('/api/question3', async (req, res) => {
    try {
        const collection = getCollection();
        const documents = await collection.aggregate(q3Aggr).toArray();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.get('/api/question4', async (req, res) => {
    try {
        const collection = getCollection();
        const documents = await collection.aggregate(q4Aggr).toArray();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.get('/api/question5', async (req, res) => {
    try {
        const collection = getCollection();
        const documents = await collection.aggregate(q5Aggr).toArray();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.get('/api/question6', async (req, res) => {
    try {
        const collection = getCollection();
        const documents = await collection.aggregate(q6Aggr).toArray();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

//TODO!! Number 7

router.get('/api/question8', async (req, res) => {
    try {
        const collection = getCollection();
        const documents = await collection.aggregate(q8Aggr).toArray();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.get('/api/question9', async (req, res) => {
    try {
        const collection = getCollection();
        const documents = await collection.aggregate(q9Aggr).toArray();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

// TODO!! Number 10

module.exports = router;
