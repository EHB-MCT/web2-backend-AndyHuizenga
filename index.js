const express = require('express')
const bodyParser = require('body-parser') /*middlewear*/
const fs = require('fs/promises')
const app = express()
const bcrypt = require('bcryptjs');
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
        const col = client.db('course-project').collection('favoriteDrinks')
        // Construct a document                                                                                                                                                              
        let newFavoriteDrink = {
            drink: req.body.drink,
            ingredient1: req.body.ingredient1,
            ingredient2: req.body.ingredient2,
            timesTried: req.body.timesTried,
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

app.get('/favoriteDrinks', async (req, res) => {

    try {
        //connect to the mongodb
        await client.connect();
        console.log("Connected correctly to server");
        //retrieve the all the drinks from the collection 'favoriteDrinks'
        const col = client.db('course-project').collection('favoriteDrinks');
        const allFavoriteDrinks = await col.find({}).toArray();

        //Send back the data with the response
        res.status(200).send(allFavoriteDrinks);
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

app.delete('/favoriteDrinks/:id', async (req, res) => {

    if (!req.params.id) {
        res.status(400).send({
            error: 'Bad Request',
            value: 'No id available in url'
        });
        return;
    }

    try {
        //connect to the mongodb
        await client.connect();
        console.log("Connected correctly to server");
        //retrieve the all the drinks from the collection 'favoriteDrinks'
        const col = client.db('course-project').collection('favoriteDrinks');

        // look in the collection for the same id and delete it
        let itemDeleted = await col.deleteOne({
            _id: ObjectId(req.params.id)
        });
        //Send back successmessage
        res.status(201).json(itemDeleted);
        return;

    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }
});

app.post('/createUsers', async (req, res) => {


    try {
        //connect to the db
        await client.connect();
        console.log("Connected correctly to server");
        //retrieve the challenges collection data
        const colli = client.db('course-project').collection('users');

        let salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);

        // Create the new Challenge object
        let userInfo = {

            name: req.body.name,
            password: hash
        }

        // Insert into the database
        let newUser = await colli.insertOne(userInfo);

        //Send back successmessage
        res.status(201).json(newUser);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }
});

app.get('/allUsers', async (req, res) => {

    try {
        //connect to the mongodb
        await client.connect();
        console.log("Connected correctly to server");
        //retrieve the all the drinks from the collection 'favoriteDrinks'
        const col = client.db('course-project').collection('users');
        const allUsers = await col.find({}).toArray();

        //Send back the data with the response
        res.status(200).send(allUsers);
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

//DONE - update a challenge
app.put('/favoriteDrinks/:id', async (req, res) => {
    //Check for body data
    if (!req.body.timesTried || !req.body.drink || !req.body.ingredient1 || !req.body.ingredient2) {
        res.status(400).send({
            error: 'Bad Request',
            value: 'Missing name, property'
        });
        return;
    }
    // Check for id in url
    if (!req.params.id) {
        res.status(400).send({
            error: 'Bad Request',
            value: 'Missing id in url'
        });
        return;
    }

    try {
        //connect to the db
        await client.connect();

        //retrieve the challenges collection data
        const col = client.db('course-project').collection('favoriteDrinks');

        // Validation for existing challenge
        const bg = await col.findOne({
            _id: ObjectId(req.params.id)
        });
        if (!bg) {
            res.status(400).send({
                error: 'Bad Request',
                value: `Challenge does not exist with id ${req.params.id}`
            });
            return;
        }
        // Create the new Challenge object
        let editDrink = {
            drink: req.body.drink,
            ingredient1: req.body.ingredient1,
            ingredient2: req.body.ingredient2,
            timesTried: req.body.timesTried,
        }
        // Add the optional session field
        if (req.body.session) {
            newChallenge.session = req.body.session;
        }

        // Insert into the database
        let timesTriedAdd = await col.updateOne({
            _id: ObjectId(req.params.id)
        }, {
            $set: editDrink
        });

        //Send back successmessage
        res.status(201).json(timesTriedAdd);
        return;
    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: 'Something went wrong',
            value: error
        });
    } finally {
        await client.close();
    }
});