const Ajv = require("ajv").default;
const ReportsDao = require("../../dao/reports-dao");
const LocationsDao = require("../../dao/locations-dao");
const DevicesDao = require("../../dao/devices-dao");
const dao = new ReportsDao();
const location_dao = new LocationsDao();
const devices_dao = new DevicesDao();

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

        body.temperature = parseFloat(body.temperature);
        body.humidity = parseFloat(body.humidity);

        const valid = ajv.validate(schema, body);

        if (!allowedRoles.includes(req.token.role) || req.token.isPublicToken) {
            res.status(403).send({ errorMessage: "Unauthorized", params: req.body })
            return;
        }

        if (valid) {
            // Ověření aktivity zařízení
            if(!(await devices_dao.GetDeviceActivity(req.token.device_id))[0].isActive) {
                res.status(402).send({
                    errorMessage: "Device is not active and can not add new report",
                    params: req.body,
                    reason: ajv.errors
                });
            }

            let location_id = (await location_dao.GetLocationByDevice(req.token.device_id))[0].location_id;

            if (!location_id) {
                res.status(402).send({
                    errorMessage: "Device is not registered to any locations because that it can not add new report",
                    params: req.body,
                    reason: ajv.errors
                });
                return;
            }

            let resp = await dao.AddReport(body, location_id);

            res.status(200).send(resp);
            return;
        }

        res.status(401).send({
            errorMessage: "Data verification failed. Wrong data",
            params: body,
            reason: ajv.errors
        })
        return;
    } catch (e) {
        res.status(500).send({
            errorMessage: "Unknown error: " + e,
            params: body,
            reason: ajv.errors
        })
        return;
    }
}

module.exports = AddReportAbl;