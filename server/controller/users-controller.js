const express = require("express");

const router = express.Router();
// Konstanty
const constants = require('../const');
// ABL
const LoginUserAbl = require("../abl/users/login-abl");
const ChangeUsersPasswordAbl = require("../abl/users/change-password-abl");
const GetUsersInfoAbl = require("../abl/users/get-info-abl");
//
router.get("/login", async (req, res) => {
    await LoginUserAbl(req, res);
});

router.post("/change-password", async (req, res) => {
    await ChangeUsersPasswordAbl(req, res);
});

router.get("/get-info", constants.authenticateToken, async (req, res) => {
    await GetUsersInfoAbl(req, res);
});

module.exports = router;