const Ajv = require("ajv").default;
const DevicesDao = require("../../dao/devices-dao");
let dao = new DevicesDao();

let schema = {
    "type": "object",
    "properties": {
    },
    "required": []
};

const allowedRoles = [0];

async function PingDeviceAbl(req, res) {
    const ajv = new Ajv();

    if (!allowedRoles.includes(req.token.role) || req.token.isPublicToken) {
        res.status(200).send({ response: false });
        return;
    }

    try {
        let resp = await dao.PingDevice({ device: req.token.device_id });

        res.status(200).send({ response: true });
        return;
    } catch (e) {
        res.status(500).send({
            errorMessage: "Unknown error: " + e,
            params: req.body,
            reason: ajv.errors
        })
        return;
    }
}

module.exports = PingDeviceAbl;