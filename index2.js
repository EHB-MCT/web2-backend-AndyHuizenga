const {
    MongoClient
} = require("mongodb");

// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://admin:admin@cluster0.jjvdl.mongodb.net/course-project?retryWrites=true&w=majority";
const client = new MongoClient(url);

// The database to use
const dbName = "course-project";

async function run() {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);

        // Use the collection "people"
        const col = db.collection("favoriteDrinks");

        // Construct a document                                                                                                                                                              
        let favoriteDrinks = {

            drink: "blue lagoon with id",
            ingredient1: "sprite",
            ingredient2: "icecubes"

        }

        // Insert a single document, wait for promise so we can read it back
        const p = await col.insertOne(favoriteDrinks);
        // Find one document
        const myDoc = await col.findOne();
        // Print to the console
        console.log(myDoc);

    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);