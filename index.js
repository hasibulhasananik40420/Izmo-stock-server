const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
// const jwt = require('jsonwebtoken');

require('dotenv').config()

const port =process.env.PORT || 5000


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.ldt7j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  
    


async function run() {
    try {
        await client.connect()
        const inventoryCollection = client.db("Inventorycollecttion").collection("Inventory");

         //post api
        app.post('/inventory' , async(req,res)=>{
          const newItem = req.body 
          const result = await inventoryCollection.insertOne(newItem);
            res.send(result)

        })

        //  get api
        // http://localhost:5000/inventory
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = inventoryCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })


        //single id
        app.get('/inventory/:id', async (req, res) => {
          const id = req.params.id
          const query = { _id: ObjectId(id) };
          const result = await inventoryCollection.findOne(query)
          res.send(result)
      })

       


        console.log('db connected yes')
    }
     finally {
    
    }
  
  }
  
  run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Running assignment 11')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })