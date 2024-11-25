const express = require("express");
const app = express();
const db = require("./db");
require("dotenv").config();
const cors = require("cors"); // Make sure to require 'cors'
const bodyParser = require("body-parser");
const User = require("./Models/user"); // Import the user model
const Measurement = require("./models/measurement"); // Import model
const Order = require("./models/order");
const router = express.Router();
const path = require("path");
app.use(express.static("./public"));

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
const PORT = process.env.PORT;
app.use("/", router);
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

//connceting Frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frmMain.html"));
});

app.get("/user", (req, res) => {
  res.sendFile(path.join(__dirname, "frmCustomer.html"));
});

app.get("/orders/new", (req, res) => {
  res.sendFile(path.join(__dirname, "frmOrder.html"));
});

app.get("/orderview", (req, res) => {
  res.sendFile(path.join(__dirname, "frmOrderView.html"));
});

app.get("/measurement", (req, res) => {
  res.sendFile(path.join(__dirname, "frmMeasurement.html"));
});

// Create User
router.post("/users", async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const newUser = new User({ name, phone, address });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

// Get All Users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Update User
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Proceed with the update
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, phone, address },
      { new: true } // Return the updated user
    );

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error); // Log the error for debugging
    res.status(500).json({ message: "Error updating user", error });
  }
});

// Delete User
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
});

// Search Users
router.get("/users/search", async (req, res) => {
  try {
    const { query } = req.query; // e.g., ?query=john
    const users = await User.find({
      $or: [
        { name: new RegExp(query, "i") },
        { phone: new RegExp(query, "i") },
        { address: new RegExp(query, "i") },
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching users", error });
  }
});

// Add Measurement
app.post("/measurements", async (req, res) => {
  try {
    const measurement = new Measurement(req.body);
    await measurement.save();
    res.status(201).send(measurement);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Update Measurement
app.put("/measurements/:id", async (req, res) => {
  try {
    const updatedMeasurement = await Measurement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMeasurement)
      return res.status(404).send("Measurement not found");
    res.send(updatedMeasurement);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete Measurement
app.delete("/measurements/:id", async (req, res) => {
  try {
    const deletedMeasurement = await Measurement.findByIdAndDelete(
      req.params.id
    );
    if (!deletedMeasurement)
      return res.status(404).send("Measurement not found");
    res.send(deletedMeasurement);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Search/Filter Measurements
app.get("/measurements", async (req, res) => {
  const query = req.query || {};
  try {
    const measurements = await Measurement.find(query);
    res.send(measurements);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST: Add a new order
router.post("/orders", async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      suitePrice,
      designPrice,
      totalPrice,
      advance,
      remaining,
      orderDate,
      deliveryDate,
      salaiType,
      suiteNumber,
      properties,
    } = req.body;

    const order = new Order({
      customerId,
      customerName,
      suitePrice,
      designPrice,
      totalPrice,
      advance,
      remaining,
      orderDate,
      deliveryDate,
      salaiType,
      suiteNumber,
      properties,
    });

    await order.save();

    res.status(201).json({
      message: "Order added successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error adding order",
      error: error.message,
    });
  }
});

// GET: Fetch all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find(); // Assuming Order is your Mongoose model
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

// DELETE: Remove an order by ID
router.delete("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting order",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log("Service is Running: " + "http://localhost:" + process.env.PORT);
});
