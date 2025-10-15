// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// // Define CORS options
// const corsOptions = {
//   origin: "http://localhost:3000",
//   // Include OPTIONS for preflight requests
//   methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"], 
//   allowedHeaders: ["Content-Type"],
//   credentials: true 
// };

// // --- CORE MIDDLEWARE SETUP ---
// // 1. CORS is applied first
// app.use(cors(corsOptions));
// app.use(express.json()); // Parses JSON request bodies

// // 2. DEBUGGING MIDDLEWARE
// // This will log every incoming request to the server terminal.
// app.use((req, res, next) => {
//     console.log(`[REQUEST] ${new Date().toISOString()} - ${req.method} ${req.url} from origin: ${req.headers.origin}`);
//     next();
// });
// // --- END CORE MIDDLEWARE SETUP ---


// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ Connection Error:", err));

// // Routes
// // Note: These routes are currently unprotected by auth middleware
// const expenseRoutes = require("./Routes/expenseRoutes"); 
// app.use("/api/expenses", expenseRoutes);

// // Simple health check route
// app.get("/", (req, res) => {
//     res.send("Expense Tracker API is running.");
// });

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// Deployement-ready version:

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Allow both localhost and your deployed frontend
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://expense-tracker-frontend-sooty-rho.vercel.app", // update after deploy
  ],
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Logging middleware (optional)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
const expenseRoutes = require("./Routes/expenseRoutes");
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => res.send("Expense Tracker API is running 🚀"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
