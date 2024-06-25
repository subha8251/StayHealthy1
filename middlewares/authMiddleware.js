const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({
        message: "Auth failed. No token provided.",
        success: false,
      });
    }

    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).send({
        message: "Auth failed. Invalid token format.",
        success: false,
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Auth failed. Token verification failed.",
          success: false,
        });
      } else {
        req.body.userId = decoded.id; // Attach the user ID to the request object
        next();
      }
    });
  } catch (error) {
    return res.status(401).send({
      message: "Auth failed",
      success: false,
    });
  }
};
