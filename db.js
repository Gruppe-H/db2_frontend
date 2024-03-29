const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27100,localhost:27200/';
const client = new MongoClient(uri);

const connectToMongoDB = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

function getClient() {
    return client;
}

function getCollection() {
    const database = client.db('spa2');
    return database.collection('emissions');
}

module.exports = { connectToMongoDB, getClient, getCollection };
