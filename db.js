require('dotenv').config();
const mongoose = require("mongoose");
const mongoURL = process.env.MONGO_URL;

const mongoConnect = () => {
 console.log(mongoURL);
 mongoose.connect(mongoURL);
};

module.exports = mongoConnect;


// mongoURL = "mongodb://127.0.0.1:27017/oneNote";