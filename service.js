import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "dotenv";
import * as authRoutesModule from "./routes/auth.js";

config();

const authRoutes = authRoutesModule.default;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/foodOrderDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// Order endpoint
app.post("/order", (req, res) => {
  try {
    const { customer, items, total } = req.body;

    console.log("📦 Order received:");
    console.log("  Customer:", customer);
    console.log("  Items:", items.length, "items");
    console.log("  Total: ₹", total);

    // Validation
    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({ message: "Customer details are required" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ SUCCESS - Order accepted
    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      orderId: "ORD-" + Date.now(),
      orderDetails: {
        customer,
        items: items.length,
        total,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: error.message || "Failed to place order" });
  }
});

app.use("/api/auth", authRoutes);

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🗄️  MongoDB URI: ${process.env.MONGO_URI}`);
});