const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

//cross origin resource sharing
const cors = require('cors');

//middleware
app.use(cors());
app.use(express.json());

//connection mongodb




app.get('/', (req, res)=>{
    res.send('running from server');
})
app.listen(port,()=>{
    console.log('runnig server')
})
