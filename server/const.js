const jwt = require('jsonwebtoken');

module.exports = Object.freeze({
    DB_HOST: 'eu-cdbr-west-03.cleardb.net',
    DB_USER: 'b355d0361f6e63',
    DB_PWD: '85d0b69a',
    DB_NAME: 'heroku_0303a822ac6b00e',
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
