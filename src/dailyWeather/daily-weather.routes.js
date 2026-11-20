const express = require("express");
const controller = require("./daily-weather.controller");

const router = express.Router();

router.route("/:location").get(controller.getDailyWeather);

module.exports = router;
