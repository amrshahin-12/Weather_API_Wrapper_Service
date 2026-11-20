const Redis = require("redis");

const client = Redis.createClient();
client.connect();

exports.getCached = async (res, location, day) => {
  const key = `${location}_${day}`;
  const value = await client.get(key);
  const data = JSON.parse(value);
  if (value) {
    res.set("X-Cache", "HIT").status(200).json({
      resolvedAddress: data.resolvedAddress,
      weather_data: data.weather_data,
    });
    return true;
  }
  return false;
};

exports.setCache = async (fetchedData, location, day) => {
  const key = `${location}_${day}`;
  const value = {
    resolvedAddress: fetchedData.data.resolvedAddress,
    weather_data: fetchedData.data.days[0],
  };
  await client.set(key, JSON.stringify(value), {
    EX: 500,
  });
};
