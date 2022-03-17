const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
// const res = require("express/lib/response");
const connectDB = require("./config/db");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

const app = express();

const hospitals = require("./routes/hospitals");
const auth = require("./routes/auth");
const appointments = require("./routes/appointments");
//add body parser
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/appointments", appointments);
app.use("/api/v1/auth", auth);

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
