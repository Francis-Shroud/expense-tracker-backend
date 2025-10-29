// const express = require("express");
// const router = express.Router();
// const Expense = require("../Models/Expense.js");
// const authMiddleware = require("../Middleware/authMiddleware.js"); // ✅ Import middleware

// // ✅ GET all expenses for the logged-in user
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const expenses = await Expense.find({ user: req.user.id })
//       .sort({ createdAt: -1 });
//     res.json(expenses);
//   } catch (err) {
//     console.error("Error fetching expenses:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ ADD new expense (linked to the logged-in user)
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { title, amount, category, createdAt } = req.body;

//     // Normalize date (use midnight time)
//     const dateOnly = createdAt
//       ? new Date(new Date(createdAt).setHours(0, 0, 0, 0))
//       : new Date(new Date().setHours(0, 0, 0, 0));

//     const expense = new Expense({
//       title,
//       amount,
//       category,
//       createdAt: dateOnly,
//       user: req.user.id, // ✅ Link expense to the user
//     });

//     await expense.save();
//     res.status(201).json(expense);
//   } catch (err) {
//     console.error("Error adding expense:", err);
//     res.status(400).json({ message: err.message });
//   }
// });

// // ✅ UPDATE expense (only if owned by the logged-in user)
// router.put("/:id", authMiddleware, async (req, res) => {
//   try {
//     const { title, amount, category, createdAt } = req.body;

//     const expense = await Expense.findById(req.params.id);
//     if (!expense) return res.status(404).json({ message: "Expense not found" });

//     // Check ownership
//     if (expense.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     // Update fields
//     if (title !== undefined) expense.title = title;
//     if (amount !== undefined) expense.amount = amount;
//     if (category !== undefined) expense.category = category;
//     if (createdAt) {
//       const dateOnly = new Date(createdAt);
//       dateOnly.setHours(0, 0, 0, 0);
//       expense.createdAt = dateOnly;
//     }

//     const updatedExpense = await expense.save();
//     res.json(updatedExpense);
//   } catch (err) {
//     console.error("Error updating expense:", err);
//     res.status(500).json({ message: "Error updating expense" });
//   }
// });

// // ✅ DELETE expense (only if owned by the logged-in user)
// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     const expense = await Expense.findById(req.params.id);
//     if (!expense) return res.status(404).json({ message: "Expense not found" });

//     // Check ownership
//     if (expense.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     await expense.deleteOne();
//     res.json({ message: "Expense deleted" });
//   } catch (err) {
//     console.error("Error deleting expense:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Expense = require("../Models/Expense.js");
const authMiddleware = require("../Middleware/authMiddleware.js");

// ✅ GET expenses for the logged-in user with optional date filters
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { year, month } = req.query; // Destructure the query parameters
    let filter = { user: req.user.id }; // Base filter: only expenses for the logged-in user

    // --- Dynamic Date Filtering Logic ---

    if (year) {
      const yearInt = parseInt(year);
      if (isNaN(yearInt)) {
        return res.status(400).json({ message: "Invalid year parameter." });
      }

      // 1. Filtering by Year (e.g., for the YearlyExpenses fetch)
      // Start date: January 1st of the requested year at midnight
      const startDate = new Date(yearInt, 0, 1);
      // End date: January 1st of the NEXT year at midnight (exclusive)
      const endDate = new Date(yearInt + 1, 0, 1);

      // If a month is also provided, we narrow the date range further
      if (month) {
        const monthInt = parseInt(month) - 1; // Convert 1-based month to 0-based month index (0-11)
        if (isNaN(monthInt) || monthInt < 0 || monthInt > 11) {
            return res.status(400).json({ message: "Invalid month parameter." });
        }
        
        // Start date: 1st of the requested month/year at midnight
        filter.createdAt = {
            $gte: new Date(yearInt, monthInt, 1),
            // End date: 1st of the NEXT month/year at midnight (exclusive)
            $lt: new Date(yearInt, monthInt + 1, 1),
        };
      } else {
        // If only year is provided, filter for the whole year
        filter.createdAt = {
            $gte: startDate,
            $lt: endDate,
        };
      }
    }
    
    // --- MongoDB Query Execution ---
    
    // The filter object will now contain { user: '...', createdAt: { $gte: '...', $lt: '...' } }
    const expenses = await Expense.find(filter).sort({ createdAt: -1 });
    
    // console.log("Applied Filter:", filter); // Good for debugging!
    
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses with filter:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ADD new expense (unchanged from your original code)
router.post("/", authMiddleware, async (req, res) => {
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
      user: req.user.id, // ✅ Link expense to the user
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error("Error adding expense:", err);
    res.status(400).json({ message: err.message });
  }
});

// ✅ UPDATE expense (unchanged from your original code)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, createdAt } = req.body;

    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Check ownership
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update fields
    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (createdAt) {
      const dateOnly = new Date(createdAt);
      dateOnly.setHours(0, 0, 0, 0);
      expense.createdAt = dateOnly;
    }

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ message: "Error updating expense" });
  }
});

// ✅ DELETE expense (unchanged from your original code)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Check ownership
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;