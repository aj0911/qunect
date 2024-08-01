//Importing statements
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const ErrorMiddlewares = require("./Middlewares/Error");

//Making objects
const app = express();
const corsConfig = {
  origin: true,
  credentials: true,
};

//Importing middlewares
app.use(cors(corsConfig));
app.use("*", cors(corsConfig));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());

//Importing router
const UserRouter = require("./Router/UserRouter");
const MessageRouter = require("./Router/MessageRouter");
const ConversationRouter = require("./Router/ConversationRouter");

//Using Routers
app.use("/api/v1", UserRouter);
app.use("/api/v1", MessageRouter);
app.use("/api/v1", ConversationRouter);

//Using middlewares for erros
app.use(ErrorMiddlewares);

module.exports = app;
