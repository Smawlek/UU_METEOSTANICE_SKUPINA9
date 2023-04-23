const Ajv = require("ajv").default;
const UsersDao = require("../../dao/users-dao");

let dao = new UsersDao();

let schema = {
    "type": "object",
    "properties": {
        "old_pass": { "type": "string" },
        "new_pass": { "type": "string" },
    },
    "required": ["old_pass", "new_pass"]
};

const allowedRoles = [1, 2];

async function ChangeUsersPasswordAbl(req, res) {
    try {
        const ajv = new Ajv();
        const body = req.query.old_pass ? req.query : req.body;

        const valid = ajv.validate(schema, body);

        if (!allowedRoles.includes(req.token.role)) {
            res.status(403).send({ errorMessage: "Unauthorized" });
            return;
        }

        if (valid) {
            let resp = await dao.ChangePassword(body, req.token.id);

            if (resp.error === 401) {
                res.status(401).send({
                    errorMessage: "Data verification failed",
                    reason: ajv.errors
                });
                return;
            }

            res.status(200).send(resp);
            return;
        }

        res.status(401).send({
            errorMessage: "Data verification failed. Wrong data",
            reason: ajv.errors
        })
        return;
    } catch (e) {
        res.status(500).send(e);
        return;
    }
}

module.exports = ChangeUsersPasswordAbl;