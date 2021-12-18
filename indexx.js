const express = require('express')
const bodyParser = require('body-parser') /*middlewear*/
const fs = require('fs/promises')
const app = express()
const port = process.env.PORT || 3000
const {
    MongoClient,
    ObjectId
} = require('mongodb');

//start the server on this port and do something
app.listen(port, () => {
    console.log(`My first rest API is running at htpp://localhost:${port}`);
})

//create a new mongodb client 
const url = "mongodb+srv://admin:admin@cluster0.jjvdl.mongodb.net/course-project?retryWrites=true&w=majority";
const client = new MongoClient(url);


//set folders public
app.use(express.static('public'));
//
app.use(bodyParser.json());

//root route 
app.get('/', (req, res) => {
    res.status(300).redirect('/info.html');
})


// setup data base name
const dbName = "course-project";

//post drink in the favoriteDrinks
app.post('/favoriteDrinks', async (req, res) => {
    try {
        //connect to mongodb
        await client.connect();
        console.log("Connected correctly to server");
        //conect to the database
        const db = client.db(dbName);

        // Use the collection "people"
        const col = db.collection("favoriteDrinks");

        // Construct a document                                                                                                                                                              
        let newFavoriteDrink = {

            drink: req.body.drink,
            ingredient1: req.body.ingredient1,
            ingredient2: req.body.ingredient2,

        }

        // Add the optional session field
        if (req.body.session) {
            newChallenge.session = req.body.session;
        }


        // Insert a single document, wait for promise so we can read it back
        let insertNewDrink = await col.insertOne(newFavoriteDrink);
        // Find one document
        const lastAdded = await col.findOne();
        // Print to the console
        res.status(201).json(newFavoriteDrink);
        return;

    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });

    } finally {
        await client.close();
    }
});