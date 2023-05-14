const express = require("express");
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("car doctor server is running");
});

require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5stkogd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const serviceCollection = client.db("carDorcor").collection("services");
    const checkoutCollection = client.db('carDorcor').collection('checkout')


    app.get('/services', async(req, res) => {
      const cursor = serviceCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // =====RECIVE ALL FROM CHECKOUT======
    app.get('/checkout_all', async(req, res) => {
      const cursor = checkoutCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
// =====GET SOME USER FROM CHECKOUT=======
    app.get('/checkout_user', async(req, res) => {
      console.log(req.query.email)
      let query = {}
      if (req.query?.email) {
        query = {email: req.query.email}
      }
      console.log(query)
      const cursor = await checkoutCollection.find(query).toArray()
      res.send(cursor)
    })

// ========UPDATE CHECKOUT========
    app.put('/checkout_all/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const filter = req.body;
      console.log(filter)
      const updateDoc = {
        $set: {
          status: filter.status
        },
      };
      const result = await checkoutCollection.updateOne(query, updateDoc)
      res.send(result)
    })

    // =========FIND ONE DATA FROM CHECKOUT========
    app.get("/checkout_all/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await checkoutCollection.findOne(query)
      res.send(result)
    })


    // ============DELETE ONE DATA FROM CHECKOUT==========
    app.delete('/checkout_all/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await checkoutCollection.deleteOne(query)
      res.send(result)
    })

    // ======POST CHECKOUT =========
    app.post('/checkout_all', async(req, res) => {
      const doc = req.body;
      const result = await checkoutCollection.insertOne(doc)
      res.send(result)
    })


// =========ALL SERVICES DATA==========
    app.get('/services/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await serviceCollection.findOne(query)
      res.send(result)
    })


  // =========JWT API=========
   app.post('/jwt', (req, res) => {
    const doc = req.body;
    
   })
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("car doctor is running in ", port);
});
