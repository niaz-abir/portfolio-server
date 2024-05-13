const express = require("express");
const cors = require("cors");

const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
// app.use(cors(Credential:true));
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("portfolio");
    const skills = db.collection("skill");
    const projects = db.collection("project");
    const blogs = db.collection("blog");

    //  add skill
    app.get("/api/v1/skill", async (req, res) => {
      const query = {};
      const result = await skills.find(query).toArray();
      res.send(result);
    });

    app.post("/api/v1/create-skill", async (req, res) => {
      const newSkill = req.body;
      const response = await skills.insertOne(newSkill);
      res.send(response);
    });
    app.delete("/api/v1/delete-skill/:id", async (req, res) => {
      const id = req.params.id;
      const response = await skills.deleteOne({ _id: new ObjectId(id) });
      console.log(response);
      res.send(response);
    });
    app.get("/api/v1/project", async (req, res) => {
      const query = {};
      const result = await projects.find(query).toArray();
      res.send(result);
    });

    app.post("/api/v1/create-project", async (req, res) => {
      const newSkill = req.body;
      const response = await projects.insertOne(newSkill);
      res.send(response);
    });
    app.delete("/api/v1/delete-project/:id", async (req, res) => {
      const id = req.params.id;
      const response = await projects.deleteOne({ _id: new ObjectId(id) });
      console.log(response);
      res.send(response);
    });
    app.get("/api/v1/blog", async (req, res) => {
      const query = {};
      const result = await blogs.find(query).toArray();
      res.send(result);
    });

    app.post("/api/v1/create-blog", async (req, res) => {
      const newSkill = req.body;
      const response = await blogs.insertOne(newSkill);
      res.send(response);
    });
    app.delete("/api/v1/delete-blog/:id", async (req, res) => {
      const id = req.params.id;
      const response = await blogs.deleteOne({ _id: new ObjectId(id) });

      res.send(response);
    });
    // add volunteer

    // app.delete("/api/v1/delete-donation/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const response = await donation.deleteOne({ _id: new ObjectId(id) });
    //   console.log(response);
    //   res.send(response);
    // });

    // app.put("/api/v1/update-donation/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const updatedDonation = req.body;
    //   const query = { _id: new ObjectId(id) };
    //   const last = await donation.findOne(query);
    //   console.log(last);

    //   const updateDoc = {
    //     $set: updatedDonation,
    //   };
    //   const result = await donation.updateOne(query, updateDoc);
    //   res.send(result);
    // });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});
