const jwt = require("jsonwebtoken");

const SEC_KEY = "we are the warriors that build this town";

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send("Authentication required!");
  }
  try {
    const data = jwt.verify(token, SEC_KEY);
    req.body.userId = data.id;
    next();
  } catch (error) {
    res.status(401).send("Invalid Token");
  }
};

module.exports = fetchUser;
