const jwt = require('jsonwebtoken');

const verifySocketJwt = (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error'));
        }
        socket.user = decoded.username;  // Attach the username to the socket object
        next();
    });
};

module.exports = verifySocketJwt;
