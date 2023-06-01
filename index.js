const dbConn = require("./db.js");
const express = require("express");
const auth = require("./routes/auth.js");
const notes = require("./routes/notes.js");
const cors = require("cors");

const app = express();
dbConn();
app.use(express.json());

const port = 4000;

app.use(cors());
app.use("/api/auth", auth);
app.use("/api/notes", notes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  
});
