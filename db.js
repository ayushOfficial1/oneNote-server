const mongoose = require("mongoose");
mongoURL = "mongodb://127.0.0.1:27017/oneNote";

const mongoConnect = () => {
  mongoose.connect(mongoURL);
};

module.exports = mongoConnect;
