const Ajv = require("ajv").default;
const UsersDao = require("../../dao/users-dao");
let dao = new UsersDao();

let schema = {
    "type": "object",
    "properties": {
    },
    "required": []
};

const allowedRoles = [1, 2];

async function GetUsersInfoAbl(req, res) {
    try {
        if (!allowedRoles.includes(req.token.role)) {
            res.status(403).send({ errorMessage: "Unauthorized", params: req.body })
            return;
        }

        let resp = await dao.GetUsersInfo(req.token.id);

        res.status(200).send(resp);
        return;
    } catch (e) {
        res.status(500).send(e)
        return;
    }
}

module.exports = GetUsersInfoAbl;