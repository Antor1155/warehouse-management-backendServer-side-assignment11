const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

//cross origin resource sharing
const cors = require('cors');

//middleware
app.use(cors());
app.use(express.json());

//connection mongodb

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mdAntor:h7HlxzP7pI28SF3M@cluster0.js1z3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log("trying to connec to db")
  client.close();
});




app.get('/', (req, res)=>{
    res.send('running from server');
})
app.listen(port,()=>{
    console.log('runnig server')
})
