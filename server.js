const express = require("express");
const dotenv = require("dotenv");
// const res = require("express/lib/response");
const connectDB = require("./config/db");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

const app = express();

const hospitals = require("./routes/hospitals");
//add body parser
app.use(express.json());
app.use("/api/v1/hospitals", hospitals);

const PORT = process.env.process || 5000;
const server = app.listen(
  PORT,
  console.log("Server running in", process.env.NODE_ENV, " mode on port ", PORT)
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close(() => process.exit(1));
});
