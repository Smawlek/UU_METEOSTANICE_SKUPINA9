const Ajv = require("ajv").default;
const ReportsDao = require("../../dao/reports-dao");
const LocationsDao = require("../../dao/locations-dao");
let dao = new ReportsDao();
let location_dao = new LocationsDao();

let schema = {
    "type": "object",
    "properties": {
        "temperature": { "type": "number" },
        "humidity": { "type": "number" },
        "date": { "type": "string" },
    },
    "required": ["temperature", "humidity", "date"]
};

const allowedRoles = [0];

async function AddReportAbl(req, res) {
    try {
        const ajv = new Ajv();
        const body = req.query.location ? req.query : req.body;
        console.log(body)
        body.temperature = parseFloat(body.temperature);
        body.humidity = parseFloat(body.humidity);

        const valid = ajv.validate(schema, body);
        console.log(body)
        console.log(valid)
        if (!allowedRoles.includes(req.token.role)) {
            res.status(403).send({ errorMessage: "Neplatné oprávnění", params: req.body })
            return;
        }

        if (valid) {
            let location_id = (await location_dao.GetLocationByDevice(req.token.device_id))[0].location_id;

            if (!location_id) {
                res.status(402).send({
                    errorMessage: "Zařízení není zaregistrováno a proto nelze přidat záznam",
                    params: req.body,
                    reason: ajv.errors
                });
                return;
            }

            let resp = await dao.AddReport(body, location_id);

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

module.exports = AddReportAbl;