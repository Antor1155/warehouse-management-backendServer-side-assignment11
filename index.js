const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');

//cross origin resource sharing
const cors = require('cors');

//middleware
app.use(cors());
app.use(express.json());

//declearing mongodb
const userName = process.env.DB_USER
const passWord = process.env.DB_PASS

const uri = `mongodb+srv://${userName}:${passWord}@cluster0.js1z3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);


//verify jwt middle ware
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;


  if (!authHeader) {
    return res.status(401).send({ message: 'unauthorized access' });
  }
  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "forbidden access" })
    }
    req.decoded = decoded;
    next();
  })

}





// working with api and data collection 
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("warehouseOfFoodCompany").collection("Products");


    // api for home page
    app.get('/home', async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);

      const products = await cursor.limit(6).toArray();

      res.send(products);
    });


    //api for getting all data
    app.get('/manageAll', async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);

      const products = await cursor.toArray();

      res.send(products);
    });

    // api for single item inventory page
    app.get('/singleItem/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });





    ///
    // api for getting items based on email id 
    app.get("/myItem", verifyJWT, async (req, res) => {
      if (req.query) {
        const decodedEmail = req.decoded.email;
        const email = req.query.email;

        if (decodedEmail === email) {
          const filter = { addedBy: email };
          const result = productCollection.find(filter);

          const product = await result.toArray();
          res.send(product);
        }
        else{
          res.status(403).send({message:"forbidden access"})
        }
      }
    })


    // api for updating one item 
    app.put('/singleItem/:id', async (req, res) => {
      const id = req.params.id;
      const updatedItem = req.body;

      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };

      const updatedDoc = {
        $set: updatedItem
      }
      const result = await productCollection.updateOne(filter, updatedDoc, option);
      res.send(result);
    })


    // api for deleting one item 
    app.delete("/deleteItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })

    //api for adding one item
    app.post("/addItem", async (req, res) => {
      const doc = req.body;
      const result = await productCollection.insertOne(doc);
      res.send(result);
    })



    // api for jwt 
    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.send({ accessToken });
    })


  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);


app.listen(port, () => {
//    console.log("port is :", port) 
})
