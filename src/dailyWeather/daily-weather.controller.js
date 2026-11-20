const axios = require("axios");
const { getCached, setCache } = require("../Utils/caching");

exports.getDailyWeather = async (req, res, next) => {
  try {
    const location = req.params.location;
    const inputDay = req.query.day;
    const day = inputDay ? inputDay : new Date().toISOString().split("T")[0];

    if (!(await getCached(res, location, day))) {
      console.log("2 inside if");
      const response = await axios({
        method: "GET",
        url: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/${day}`,
        timeout: 10000,
        params: {
          unitGroup: "metric",
          include: "days",
          elements: "datetime,tempmax,tempmin,temp,humidity,conditions",
          contentType: "json",
        },
      });

      setCache(response, location, day);

      return res.set("X-Cache", "MISS").status(200).json({
        resolvedAddress: response.data.resolvedAddress,
        weather_data: response.data.days[0],
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message:
        "no data found for that location, make sure it exists and format is valid!",
    });
  }
};
