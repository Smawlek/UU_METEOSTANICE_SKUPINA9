require('dotenv').config({ path: __dirname + '/./../../.env' });

const Ajv = require("ajv").default;
const LocationsDao = require("../../dao/locations-dao");
let dao = new LocationsDao();

const jwt = require('jsonwebtoken');

let schema = {
    "type": "object",
    "properties": {
        "location": { "type": "number" },
    },
    "required": ["location"]
};

const allowedRoles = [1, 2];

async function ChangeLocationsPublicTokenAbl(req, res) {
    try {
        if (!allowedRoles.includes(req.token.role) || req.token.isPublicToken) {
            res.status(403).send({ errorMessage: "Unauthorized", params: req.body })
            return;
        }

        const ajv = new Ajv();
        const body = req.query.location ? req.query : req.body;

        body.location = Number(body.location);

        const valid = ajv.validate(schema, body);

        if (valid) {
            let resp = await dao.ChangePublicToken(body.location);

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
        res.status(500).send(e)
        return;
    }
}

module.exports = ChangeLocationsPublicTokenAbl;