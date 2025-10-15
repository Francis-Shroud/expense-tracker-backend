const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense.js");

// GET all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD new expense
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, createdAt } = req.body;

    // Normalize date (use midnight time)
    const dateOnly = createdAt
      ? new Date(new Date(createdAt).setHours(0, 0, 0, 0))
      : new Date(new Date().setHours(0, 0, 0, 0));

    const expense = new Expense({
      title,
      amount,
      category,
      createdAt: dateOnly,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error("Error adding expense:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE expense
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE expense (new)
router.put("/:id", async (req, res) => {
  try {
    const { title, amount, category, createdAt } = req.body;
    //Build update object dynamically
    const updateData = { title, amount, category };
    if (createdAt) 
      {
        const dateOnly = new Date(createdAt);
        dateOnly.setHours(0, 0, 0, 0); // Normalize to start of day
        updateData.createdAt = dateOnly;
      
      }
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating expense" });
  }
});

module.exports = router;
