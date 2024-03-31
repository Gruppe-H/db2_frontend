# Database assignment 2
## By Group H (Caroline and Maria)

This is the frontend to the database assignment, where the answers to our questions can be found.

### To run
To run make sure to have made a database called spa2 and a collection called emissions 

or change the database- and collection name in `db.js` in the function:
```
function getCollection() {
    const database = client.db('<<your-database-name>>');
    return database.collection('<<your-collection-name>>');
}
```

In your mongoDB collection import the JSON files from [here.](https://github.com/Gruppe-H/DB_assignment2/tree/master/jsons)

Then clone this repository.

Navigate to the project folder and run `node app.js` in for example Git Bash or CMD. Then open to [localhost](http://localhost:3000/)
