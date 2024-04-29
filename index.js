const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//config
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middlewar
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.i7qzqrj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const database = client.db("ArtDB");
    const subcategory = database.collection("sub_category");
    const allart = database.collection("allart");

    app.get("/allart/limited", async (req, res) => {
      const cursor = allart.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/allart", async (req, res) => {
      const cursor = allart.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/allart/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: new ObjectId(id) };
      const result = await allart.findOne(query);
      res.send(result);
    });
    
    app.get("/sub_category", async (req, res) => {
      const cursor = subcategory.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });
    app.get('/cat/:id', async(req, res) => {
        const {id} = req.params;
        const result = await allart.find({subcategory: id}).toArray();
        res.send(result)
    })
    app.get("/mycraft/:email", async (req, res) => {
      const email = req.params.email;
      const result = await allart.find({ email: email }).toArray();
      res.send(result);
    });
    app.post("/allart", async (req, res) => {
      const newArt = req.body;
      console.log(newArt);
      const result = await allart.insertOne(newArt);
      res.send(result);
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("app is running");
});

app.listen(port, () => {
  console.log(`your server is running on ${port}`);
});
