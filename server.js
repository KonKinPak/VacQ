const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
// const res = require("express/lib/response");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

const app = express();
const hospitals = require("./routes/hospitals");
const auth = require("./routes/auth");
const appointments = require("./routes/appointments");
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000,
  max: 100,
});

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express VacQ API",
    },
    servers: [
      {
        url: "http://localhost:5050/api/v1",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
//add body parser
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use(cors());
app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/appointments", appointments);
app.use("/api/v1/auth", auth);

const PORT = process.env.PORT || 9213;
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
