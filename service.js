const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const { protect } = require("./middleware/auth");
const { roleCheck } = require("./middleware/roleCheck");
const User = require("./models/User");

const app = express();

// ✅ FIX: Allow all origins during development
app.use(cors());
app.use(express.json());

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// ================= AUTH ROUTES =================
app.use("/api/auth", authRoutes);

// ================= CONNECT MONGODB =================
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/foodOrderDB";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ DB Error:", err.message);
  });

// ================= ORDER SCHEMA =================
const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    phone: String,
    address: String,
  },
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      category: String,
    },
  ],
  total: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

// ================= PLACE ORDER (Protected - any authenticated user) =================
app.post("/order", protect, async (req, res) => {
  try {
    const { customer, items, total } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty or invalid data",
      });
    }

    const newOrder = await Order.create({
      customer,
      items,
      total,
      user: req.user._id,
    });

    res.json({
      success: true,
      message: "🎉 Order placed successfully!",
      order: newOrder,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ================= GET ORDERS (Admin: all orders, Customer: own orders) =================
app.get("/orders", protect, async (req, res) => {
  try {
    let orders;
    if (req.user.role === "admin") {
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    }
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ================= GET ALL USERS (Admin only) =================
app.get("/api/users", protect, roleCheck("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
