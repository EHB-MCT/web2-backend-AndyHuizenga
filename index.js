const express = require('express')();
const fs = require('fs/promises');
const app = express;
const port = 3000;


//root route 
app.get('/', (req, res) => {
    res.status(300).redirect('/info.html')
})

//return all drinks from the file
app.get('/drinks', async (req, res) => {
    try {
        //read the file 
        let data = await fs.readFile('data/drinks.json')
        //send back the file contents
        res.status(200).send(JSON.parse(data));
    } catch (error) {
        res.status(500).send('File could not be read! Try again later.....');
    }
});

app.get('/drinks',(req, res) => {
    res.send('everything OK');
})

app.listen(port, () => {
    console.log(`API is running at htpp://localhost:${port}`);
})

//drinks?id=69