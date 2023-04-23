const express = require("express");

const router = express.Router();
// Konstanty
const constants = require('../const');
// ABL
const ListUsersLocationsAbl = require("../abl/locations/list-users-abl");
const ChangeLocationsPublicTokenAbl = require("../abl/locations/change-public-abl");
//
router.get("/list-users", constants.authenticateToken, async (req, res) => {
    await ListUsersLocationsAbl(req, res);
});

router.get("/change-public-token", constants.authenticateToken, async (req, res) => {
    await ChangeLocationsPublicTokenAbl(req, res);
});

module.exports = router;