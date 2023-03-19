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
        /*
        if (!allowedRoles.includes(req.token.role)) {
            res.status(403).send({ errorMessage: "Neplatné oprávnění", params: req.body })
            return;
        }*/

        if (valid) {
            let resp = await dao.LogDevice(body);

            if (!resp) {
                res.status(402).send({
                    errorMessage: "Chybný dotaz na server",
                    params: req.body,
                    reason: ajv.errors
                });
                return;
            }

            if (resp[0].device_id > 0) {
                let temp = {location_id: resp[0].location_id, device_id: resp[0].device_id, role: 0};
                resp = JSON.parse(resp)
                resp[0].token = jwt.sign(temp, process.env.ACCESS_TOKEN_SECRET);
                resp = JSON.stringify(resp);
                res.status(200).send(resp);
                return;
            }
        }

        res.status(401).send({
            errorMessage: "Ověření údajů se nezdařilo. Chybné údaje",
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