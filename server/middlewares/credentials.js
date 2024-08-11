const { allowedOrigin } = require("../config/corsConfig");

const credentials = (req, res, next) => {
    const { origin } = req.headers;
    if (allowedOrigin.includes(origin)) {
        res.setHeader("Access-Control-Allow-Credentials", true);
    }
    next();
}

module.exports = credentials;
