const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");

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

    const db = client.db("assignment");
    const collection = db.collection("users");
    const donation = db.collection("donation");
    const testimonial = db.collection("testimonial");
    const volunteer = db.collection("volunteer");
    const leaderBoard = db.collection("leaderBoard");
    const feedback = db.collection("feedback");

    // User Registration
    app.post("/api/v1/register", async (req, res) => {
      const { name, email, password } = req.body;

      // Check if email already exists
      const existingUser = await collection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into the database
      await collection.insertOne({ name, email, password: hashedPassword });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    });

    // User Login
    app.post("/api/v1/login", async (req, res) => {
      const { email, password } = req.body;

      // Find user by email
      const user = await collection.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN,
      });

      res.json({
        success: true,
        message: "Login successful",
        token,
      });
    });

    // add testimonial
    app.get("/api/v1/testimonial", async (req, res) => {
      const query = {};
      const result = await testimonial.find(query).toArray();
      res.send(result);
    });

    app.post("/api/v1/create-testimonial", async (req, res) => {
      const newTestimonial = req.body;
      const response = await testimonial.insertOne(newTestimonial);
      res.send(response);
    });
    // add volunteer
    app.get("/api/v1/volunteer", async (req, res) => {
      const query = {};
      const result = await volunteer.find(query).toArray();
      res.send(result);
    });

    app.post("/api/v1/create-volunteer", async (req, res) => {
      const newVolunteer = req.body;
      const response = await volunteer.insertOne(newVolunteer);
      res.send(response);
    });
    // show leader board data
    app.get("/api/v1/leader-board", async (req, res) => {
      const query = {};
      const result = await leaderBoard
        .find(query)
        .sort({ amount: -1 })
        .toArray();
      result.forEach((entry) => {
        entry.amount = parseInt(entry.amount);
      });
      res.send(result);
    });
    // feedback section

    app.get("/api/v1/feedback", async (req, res) => {
      const query = {};
      const result = await feedback.find(query).toArray();
      res.send(result);
    });

    app.post("/api/v1/create-feedback", async (req, res) => {
      const newFeedback = req.body;
      const response = await feedback.insertOne(newFeedback);
      res.send(response);
    });

    app.get("/api/v1/donation", async (req, res) => {
      const query = {};
      const result = await donation.find(query).toArray();
      res.send(result);
    });
    app.get("/api/v1/donation/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await donation.findOne(query);
      res.send(result);
    });

    app.post("/api/v1/create-donation", async (req, res) => {
      const newDonation = req.body;
      const response = await donation.insertOne(newDonation);
      res.send(response);
    });

    app.delete("/api/v1/delete-donation/:id", async (req, res) => {
      const id = req.params.id;
      const response = await donation.deleteOne({ _id: new ObjectId(id) });
      console.log(response);
      res.send(response);
    });

    app.put("/api/v1/update-donation/:id", async (req, res) => {
      const id = req.params.id;
      const updatedDonation = req.body;
      const query = { _id: new ObjectId(id) };
      const last = await donation.findOne(query);
      console.log(last);

      const updateDoc = {
        $set: updatedDonation,
      };
      const result = await donation.updateOne(query, updateDoc);
      res.send(result);
    });

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
