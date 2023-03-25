require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const userRoutes = require("./routes/v1/user.route");

// const app = express();
// const PORT = 8082;

let server;

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => console.log("Connected to DB at", config.mongoose.url))
  .catch((error) => console.log("Failed to connect to DB\n", error));

  
app.use("/v1/users", userRoutes);

  app.listen(config.port, () => {
    console.log("Server Listening at", config.port);
  });
// const mongoose = require("mongoose");
// const app = require("./app");
// const config = require("./config/config");

// let server;

