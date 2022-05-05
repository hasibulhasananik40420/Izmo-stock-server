const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
const jwt = require('jsonwebtoken');

require('dotenv').config()

const port =process.env.PORT || 5000


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.ldt7j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  
    


async function run() {
    try {
        await client.connect()
        const inventoryCollection = client.db("Inventorycollecttion").collection("Inventory");


        // app.post('/token', async(req,res)=>{
        //   const email = req.body 
        //   console.log(email);
        //   1.28 mit
        //   const token = jwt.sign(email, 'shhhhh');
        //   const token = jwt.sign(email, process.env.ACCESS_TOKEN);
        //   res.send({token})
        // })


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

         //my item
        //   http://localhost:5000/myitems
          app.get('/myitems', async (req, res) => {
          const email = req.query.email
          const query = { email: email };
          // console.log(email);
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

       //delete api

        app.delete('/inventory/:id',async(req,res)=>{
          const id = req.params.id 
          const query = {_id: ObjectId(id)}
          const result = await inventoryCollection.deleteOne(query)
          res.send(result)
        })

        //put data 
        app.put('/inventory/:id', async (req, res) => {
          const id = req.params.id
          const updatedStock = req.body
          const filter = { _id: ObjectId(id) };
          const options = { upsert: true };
          const updateDocument = {
              $set: updatedStock
          };
          const result = await inventoryCollection.updateOne(filter, updateDocument, options)

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