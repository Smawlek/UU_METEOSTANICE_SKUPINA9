const Ajv = require("ajv").default;
const DevicesDao = require("../../dao/devices-dao");
let dao = new DevicesDao();

let schema = {
    "type": "object",
    "properties": {
    },
    "required": []
};

const allowedRoles = [];

async function PingDeviceAbl(req, res) {
    const ajv = new Ajv();
    
    try {
        let resp = await dao.PingDevice({ location: req.token.location, device: req.token.device });

        if (!resp) {
            res.status(402).send({
                errorMessage: "Chybný dotaz na server",
                params: req.body,
                reason: ajv.errors
            });
            return;
        }

        res.status(200).send(resp);
        return;
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