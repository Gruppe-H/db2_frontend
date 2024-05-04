const neo4j = require('neo4j-driver');

// Neo4j connection URI
const uri = 'bolt://localhost:7687';
const user = 'neo4j';
const password = '12345678';

// Create a Neo4j driver instance
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// Function to connect to Neo4j database
const connectToNeo4j = async () => {
    try {
        await driver.verifyConnectivity();
        console.log('Connected to Neo4j');
    } catch (error) {
        console.error('Error connecting to Neo4j:', error);
    }
};

// Function to get Neo4j driver instance
function getDriver() {
    return driver;
}

// Function to get a Neo4j session
function getSession() {
    return driver.session();
}

module.exports = { connectToNeo4j, getDriver, getSession };

