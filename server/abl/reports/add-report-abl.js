const Ajv = require("ajv").default;
const ReportsDao = require("../../dao/reports-dao");
let dao = new ReportsDao();

let schema = {
    "type": "object",
    "properties": {
        "location": { "type": "number" },
        "temperature": { "type": "number" },
        "humidity": { "type": "number" },
        "date": { "type": "string" },
    },
    "required": ["location", "temperature", "humidity", "date"]
};

const allowedRoles = [0];

async function AddReportAbl(req, res) {
    try {
        const ajv = new Ajv();
        const body = req.query.location ? req.query : req.body;

        body.location = Number(body.location);
        body.temperature = parseFloat(body.temperature);
        body.humidity = Number(body.humidity);

        const valid = ajv.validate(schema, body);
        
        if (!allowedRoles.includes(req.token.role)) {
            res.status(403).send({ errorMessage: "Neplatné oprávnění", params: req.body })
            return;
        }

        if (valid) {
            let resp = await dao.AddReport(body);

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