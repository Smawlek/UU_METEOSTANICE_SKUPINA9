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

    if (!allowedRoles.includes(req.token.role)) {
        res.status(403).send({ errorMessage: "Neplatné oprávnění", params: req.body })
        return;
    }

    try {
        let resp = await dao.PingDevice({ device: req.token.device_id });

        if (!resp) {
            res.status(402).send({
                errorMessage: "Chybný dotaz na server",
                params: req.body,
                reason: ajv.errors
            });
            return;
        }

        if (resp.length > 0) {
            res.status(200).send(resp);
            return;
        }
    } catch (e) {
        res.status(500).send({
            errorMessage: "Neočekávaná chyba: " + e,
            params: req.body,
            reason: ajv.errors
        })
        return;
    }
}

module.exports = PingDeviceAbl;