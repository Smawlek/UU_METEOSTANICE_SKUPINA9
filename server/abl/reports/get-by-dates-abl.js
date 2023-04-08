const Ajv = require("ajv").default;
const ReportsDao = require("../../dao/reports-dao");
const LocationsDao = require("../../dao/locations-dao");
let dao = new ReportsDao();
let location_dao = new LocationsDao();

let schema = {
    "type": "object",
    "properties": {
        "start": { "type": "string" }, 
        "end": { "type": "string" },
        "granularity": { "type": "number" },
    },
    "required": ["start", "end"]
};

const allowedRoles = [0];

async function GetReportsByDatesAbl(req, res) {
    try {
        const ajv = new Ajv();
        const body = req.query.start ? req.query : req.body;

        body.granularity = Number(body.granularity);

        const valid = ajv.validate(schema, body);

        if (!allowedRoles.includes(req.token.role)) {
            res.status(403).send({ errorMessage: "Neplatné oprávnění", params: req.body })
            return;
        }

        if (valid) {
            let location_id = (await location_dao.GetLocationByDevice(req.token.device_id))[0].location_id;

            if (!location_id) {
                res.status(402).send({
                    errorMessage: "Zařízení není zaregistrováno a proto nelze získat záznamy",
                    params: req.body,
                    reason: ajv.errors
                });
                return;
            }

            let resp = await dao.GetReportsByDates(body, location_id);

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

module.exports = GetReportsByDatesAbl;