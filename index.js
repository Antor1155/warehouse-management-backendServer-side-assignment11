const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
require('dotenv').config();

//cross origin resource sharing
const cors = require('cors');

//middleware
app.use(cors());
app.use(express.json());

//declearing mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.js1z3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);


// working with api and data collection 
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("warehouseOfFoodCompany").collection("Products");

/// for home page
    app.get('/home', async(req,res) => {
      const query = {};
      const cursor = productCollection.find(query);

      const products = await cursor.limit(6).toArray();

      console.log(products.length);
      res.send(products);

    });

















  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('running from server');
})
app.listen(port, () => {
  console.log('runnig server')
})
