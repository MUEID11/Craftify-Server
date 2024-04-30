const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//config
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middlewar
app.use(cors({
  origin: ["http://localhost:5173", "https://b9-assignment10.firebaseapp.com", "https://b9-assignment10.web.app"]
}));//
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
    app.get("/allartcraft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allart.findOne(query);
      res.send(result);
    });
    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allart.findOne(query);
      res.send(result);
    });
    app.get("/customization/:id/:email", async (req, res) => {
      const { id } = req.params;
      const {email} = req.params;
      const query = { customization: { $regex: new RegExp(`^${id}$`, "i") } , email: email };
      const result = await allart.find(query).toArray();
      console.log("Query result:", result);
      res.send(result);
    });
    app.put("/updateitem/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateArt = req.body;
      const art = {
        $set: {
          email: updateArt.email,
          name: updateArt.name,
          photo: updateArt.photo,
          itemName: updateArt.itemName,
          subcategory: updateArt.subcategory,
          stockStatus: updateArt.stockStatus,
          shortDescription: updateArt.shortDescription,
          price: updateArt.price,
          rating: updateArt.rating,
          customization: updateArt.customization,
          processingTime: updateArt.processingTime,
        },
      };
      const result = await allart.updateOne(filter, art, options);
      res.send(result);
    });

    app.get("/sub_category", async (req, res) => {
      const cursor = subcategory.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/cat/:id", async (req, res) => {
      const { id } = req.params;
      const result = await allart.find({ subcategory: id }).toArray();
      res.send(result);
    });
    app.get("/mycraft/:email", async (req, res) => {
      const email = req.params.email;
      const result = await allart.find({ email: email }).toArray();
      res.send(result);
    });
    app.post("/allart", async (req, res) => {
      const newArt = req.body;
      const result = await allart.insertOne(newArt);
      res.send(result);
    });

    app.delete("/deleteitem/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await allart.deleteOne(query);
      res.send(result);
      console.log(id);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.error);

// app.get("/", (req, res) => {
//   res.send("app is running");
// });

app.listen(port, () => {
  console.log(`your server is running on ${port}`);
});
