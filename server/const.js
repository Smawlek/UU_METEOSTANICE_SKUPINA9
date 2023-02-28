const jwt = require('jsonwebtoken');

module.exports = Object.freeze({
    DB_HOST: '',
    DB_USER: '',
    DB_PWD: '',
    DB_NAME: '',
    authenticateToken
});

function authenticateToken(req, res, next) {
    const token = req.headers.token;

    if(token === null) {
        res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.sendStatus(403);
        }

        req.token = user[0];
        
        next();
    })
}
