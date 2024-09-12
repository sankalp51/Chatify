const allowedOrigin = ["https://chat-app-zeta-red.vercel.app"];

const corsConfig = {
    origin: function (origin, callback) {
        if (allowedOrigin.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = { allowedOrigin, corsConfig }