const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const dbConnection = require("./config/DB_connection");
const adminRoute = require("./routes/admin.route.js");
const userRoute = require("./routes/user.route.js");
const examRoute = require("./routes/exam.route.js");
const error = require("./middlewares/error");
const app = express();
dotenv.config();

//                                 **Middlewares**

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mahmoud-ebrahim-elazony.tech",
      "https://www.mahmoud-ebrahim-elazony.tech",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());

//                                 **ROUTES**

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/exam", examRoute);

app.use(error);

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT || 2000, () => {
    dbConnection();
    console.log(
      `Server is running on port ${process.env.PORT} on http://localhost:${
        process.env.PORT || 2000
      }`
    );
  });
}

module.exports = app;
