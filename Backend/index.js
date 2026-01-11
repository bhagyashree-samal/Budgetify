require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashBoardRoutes = require("./routes/dashBoardRoutes");

//middileware to handle cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashBoard", dashBoardRoutes);

const port = 8080;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
