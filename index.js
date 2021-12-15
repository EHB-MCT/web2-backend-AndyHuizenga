const express = require('express')
const bodyParser = require('body-parser') /*middlewear*/
const fs = require('fs/promises')
const app = express()
const port = process.env.PORT || 3000


app.use(express.static('public'));
//
app.use(bodyParser.json());
//root route 
app.get('/', (req, res) => {
    res.status(300).redirect('/info.html');
})



//mongodb config

const {
    
}

//return all drinks from the file
app.get('/drinks', async (req, res) => {
    try {
        //read the file 
        let data = await fs.readFile('data/drinks.json');

        //fs is reading files as a string,don't forgot the JSON.parse = making it an object; 
        //send back the file contents
        res.status(200).send(JSON.parse(data));
    } catch (error) {
        res.status(500).send('File could not be read! Try again later.....');
    }
});

//drinks?id=69

//get a specific drink
app.get('/drink', async (req, res) => {
    //response 
    console.log(req.query.id);
    try {
        //read the file 
        let allDrinks = JSON.parse(await fs.readFile('data/drinks.json'));


        //fs is reading files as a string,don't forgot the JSON.parse = making it an object; 
        //send back the file contents

        let favoritedrink = allDrinks[req.query.id];

        if (favoritedrink) {
            res.status(200).send(favoritedrink);
            return
        } else {
            res.status(200).send('Drink could not be find')
        }



    } catch (error) {
        console.log(error);
        res.status(500).send('File could not be read! Try again later.....');
    }
})

app.get('/userinfo', (req, res) => {
    //response 
    let exampleData = {
        name: "Andy",
        age: "20",
        password: "password"
    }
    res.send(exampleData);
})

//start the server on this port and do something
app.listen(port, () => {
    console.log(`My first rest API is running at htpp://localhost:${port}`);
})

app.post('/saveNewDrink', async (req, res) => {
    console.log(req.body)

    //check if all information is available
    if (!req.body.id || !req.body.drink || !req.body.ingredient1 || !req.body.ingredient2) {
        res.status(404).send("Bad request, missing info");
     return;
    }

    try {
        let allDrinks = JSON.parse(await fs.readFile('data/drinks.json'));

        allDrinks[req.body.id] = {
            drink: req.body.drink,
            ingredient1: req.body.ingredient1,
            ingredient2: req.body.ingredient2,
        }

        //safe the file 
        await fs.writeFile('data/drinks.json', JSON.stringify(allDrinks))

        //send back successfully
        res.status(200).send('This drink has successfully been added to the list')

        return;
    } catch (e) {
        res.status(500).send('Error took place');
    }

})