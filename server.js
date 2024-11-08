
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); 

const db = require("./config/db"); 
const router = require("./routes/emailRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
// app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
