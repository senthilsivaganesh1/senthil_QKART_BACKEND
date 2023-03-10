const express = require("express");
const userRoute = require("./user.route");

const router = express.Router();
router.use("/users", userRoute);

// router.get("/:username", getUserByUsername);


// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Reroute all API requests beginning with the `/v1/users` route to Express router in user.route.js


module.exports = router;
