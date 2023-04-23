require('dotenv').config({ path: __dirname + '/./../../.env' });

const Ajv = require("ajv").default;
const UsersDao = require("../../dao/users-dao");
let dao = new UsersDao();

const jwt = require('jsonwebtoken');

let schema = {
    "type": "object",
    "properties": {
        "email": { "type": "string" },
        "password": { "type": "string" },
    },
    "required": ["email", "password"]
};

async function LoginUserAbl(req, res) {
    try {
        const ajv = new Ajv();
        const body = req.query.email ? req.query : req.body;
        const valid = ajv.validate(schema, body);

        if (valid) {
            let user = await dao.LoginUser(body);

            if (user[0].id != undefined && user[0].id > 0) {
                let s = {id: user[0].id, name: user[0].name, email: user[0].email, role: user[0].role};
                user[0].token = jwt.sign(s, process.env.ACCESS_TOKEN_SECRET);
                user = JSON.stringify(user);
                res.status(200).send(user);
                return;
            }

            res.status(405).send({
                errorMessage: "User with these informations does not exist",
                reason: ajv.errors
            });
            return;
        }

        res.status(401).send({
            errorMessage: "Data verification failed. Wrong data",
            reason: ajv.errors
        });
        return;
    } catch (e) {
        res.status(500).send(e);
        return;
    }
}

module.exports = LoginUserAbl;