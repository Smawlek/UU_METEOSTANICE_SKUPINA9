require('dotenv').config({ path: __dirname + '/./../../.env' });

const Ajv = require("ajv").default;
const DevicesDao = require("../../dao/devices-dao");
let dao = new DevicesDao();

const jwt = require('jsonwebtoken');

let schema = {
    "type": "object",
    "properties": {
        "password": { "type": "string" },
        "device": { "type": "string" },
    },
    "required": ["password", "device"]
};

const allowedRoles = [];

async function LogDeviceAbl(req, res) {
    try {
        const ajv = new Ajv();
        const body = req.query.password ? req.query : req.body;
        const valid = ajv.validate(schema, body);

        if (valid) {
            let resp = await dao.LogDevice(body);

            if (resp[0].device_id > 0) {
                let temp = {device_id: resp[0].device_id, role: 0, isPublicToken: false};
                resp[0].token = jwt.sign(temp, process.env.ACCESS_TOKEN_SECRET);
                resp = JSON.stringify(resp);
                res.status(200).send(resp);
                return;
            }

            res.status(401).send({
                errorMessage: "Log in failed. Device does not exist",
                params: body,
                reason: ajv.errors
            });
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

module.exports = LogDeviceAbl;