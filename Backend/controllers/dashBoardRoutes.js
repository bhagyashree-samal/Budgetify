const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userObjectId = new Types.ObjectId(req.user._id);

    // TOTAL INCOME
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // TOTAL EXPENSE
    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // LAST 60 DAYS INCOME
    const last60DaysIncomeTransaction = await Income.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const incomeLast60Days = last60DaysIncomeTransaction.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // LAST 30 DAYS EXPENSE
    const last30DaysExpenseTransaction = await Expense.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    const expenseLast30Days = last30DaysExpenseTransaction.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    // RECENT TRANSACTIONS
    const lastTransactions = [
      ...(await Income.find({ userId: userObjectId })
        .sort({ date: -1 })
        .limit(5))
        .map(txn => ({ ...txn.toObject(), type: "income" })),

      ...(await Expense.find({ userId: userObjectId })
        .sort({ date: -1 })
        .limit(5))
        .map(txn => ({ ...txn.toObject(), type: "expense" })),
    ].sort((a, b) => b.date - a.date);

    res.json({
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      totalBalance:
        (totalIncome[0]?.total || 0) -
        (totalExpense[0]?.total || 0),
      last60DaysIncome: {
        total: incomeLast60Days,
        transaction: last60DaysIncomeTransaction,
      },
      last30DaysExpenses: {
        total: expenseLast30Days,
        transaction: last30DaysExpenseTransaction,
      },
      recentTransactions: lastTransactions,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
