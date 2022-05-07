const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const {MongoClient} = require('mongodb');

//cross origin resource sharing
const cors = require('cors');

//middleware
app.use(cors());
app.use(express.json());

//connection mongodb
const uri = "mongodb+srv://mdAntor:h7HlxzP7pI28SF3M@cluster0.js1z3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const productCollection = client.db("warehouseOfFoodCompany").collection("Products");
 

    // create a document to insert
    const doc = {
      title: "Record of a Shriveled Datum",
      content: "No bytes, no problem. Just insert a document, in MongoDB",
    }

    // const result = await haiku.insertOne(doc);
    // console.log(`A document was inserted with the _id: ${result.insertedId}`);
    // console.log('result is', result);

  }  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('running from server');
})
app.listen(port,()=>{
    console.log('runnig server')
})
