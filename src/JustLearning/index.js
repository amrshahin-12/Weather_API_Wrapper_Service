const axios = require("axios");
const express = require("express");

const router = express.Router();

const Redis = require("redis");

const redisClient = Redis.createClient();
redisClient.connect();

router.get("/comments", async (req, res) => {
  getData(res, null);
});

router.get("/comments/:id", async (req, res) => {
  const id = req.params.id;
  getData(res, id);
});

const getData = async (res, id) => {
  try {
    const cacheKey = id ? `comment:${id}` : "comments";
    const returnedData = await redisClient.get(cacheKey);
    if (returnedData) {
      console.log("cache hit");
      return res.json(JSON.parse(returnedData));
    }

    console.log("cache miss");
    const url = id
      ? `https://dummyjson.com/comments/${id}`
      : `https://dummyjson.com/comments`;
    const { data } = await axios.get(url);
    await redisClient.setEx(cacheKey, 100, JSON.stringify(data.comments));
    res.json(data.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      err: "faild to get your data!",
    });
  }
};

module.exports = router;
