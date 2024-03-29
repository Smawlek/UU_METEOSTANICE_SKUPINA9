require('dotenv').config({ path: __dirname + '/./../../.env' });

const Ajv = require("ajv").default;
const DevicesDao = require("../../dao/devices-dao");
let dao = new DevicesDao();

const jwt = require('jsonwebtoken');

let schema = {
    "type": "object",
    "properties": {
        "public_token": { "type": "string" },
    },
    "required": ["public_token"]
};

const allowedRoles = [];

async function LogPublicAbl(req, res) {
    try {
        const ajv = new Ajv();
        const body = req.query.public_token ? req.query : req.body;
        const valid = ajv.validate(schema, body);

        if (valid) {
            let resp = await dao.LogPublic(body);

            if (resp[0].device_id > 0) {
                let temp = {device_id: resp[0].device_id, role: 'READ-ONLY', isPublicToken: true};
                resp[0].token = jwt.sign(temp, process.env.ACCESS_TOKEN_SECRET);
                resp = JSON.stringify(resp);
                res.status(200).send(resp);
                return;
            }

            res.status(401).send({
                errorMessage: "Log in failed. Device does not exist",
                params: body,
                reason: ajv.errors
            })
            return;
        }

        res.status(401).send({
            errorMessage: "Data verification failed. Wrong data",
            params: body,
            reason: ajv.errors
        })
        return;
    } catch (e) {
        res.status(500).send(e)
        return;
    }
}

module.exports = LogPublicAbl;