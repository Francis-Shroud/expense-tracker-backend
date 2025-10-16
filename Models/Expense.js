const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      default: "General",
    },
    createdAt: {
      type: Date,
      default: () => new Date(new Date().setHours(0,0,0,0)),  // 👈 default to current date
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: false } // 👈 this line adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("Expense", expenseSchema);