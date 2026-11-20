const express = require("express");
const JustLearning = require("./JustLearning/index");
const dailyWeatherRouter = require("./dailyWeather/daily-weather.routes");
const app = express();
app.use(express.json({ limit: "10kb" }));

app.use("/JustLearning", JustLearning);
app.use("/daily-weather", dailyWeatherRouter);

module.exports = app;
