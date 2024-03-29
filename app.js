const express = require('express');
const { connectToMongoDB } = require('./db');
const routes = require('./routes/routes');

const app = express();
const port = 3000;

connectToMongoDB();

app.get('/', (req, res) => {
    res.send('<h1>SPA2</h1>' +
        '<div><h4>By Group H: Caroline and Maria</h4></div>' +
        '<div><h2>Our ten questions:</h2>' +
        '<ol>\n' +
        '        <li>Is there a correlation between population and total emissions?</li>\n' +
        '        <li>From 2016 to 2017, has there been a reduction in base emissions?</li>\n' +
        '        <li>From 2016 to 2017, what change has there been in target emission?</li>\n' +
        '        <li>Is there a difference in the target reduction emissions based on whether or not the city is a member of C40 or GCoM?</li>\n' +
        '        <li>What difference is there between each region and their target emission?</li>\n' +
        '        <li>Which organization plans to reduce the most in %?</li>\n' +
        '        <li>What correlation is there between GDP, base emissions and target emissions?</li>\n' +
        '        <li>How many countries are represented in the data?</li>\n' +
        '        <li>How many have a desired target emission without a base emission?</li>\n' +
        '        <li>Is there a correlation between baseline year and the target emissions?</li>\n' +
        '    </ol>' +
        '</div>' + '<div><h2>Answers:</h2>' +
        'To see the answers to the questions, see /api/question{n} for question n, ' +
        'e.g. <a href="/api/question1">/api/question1</a> for the answer to question1</div>');
});

app.use('/', routes);

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
