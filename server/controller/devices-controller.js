const express = require("express");

const router = express.Router();
// Konstanty
const constants = require('../const');
// ABL
const PingDeviceAbl = require("../abl/devices/ping-device-abl");
const LogDeviceAbl = require("../abl/devices/log-device-abl");
const LogPublicAbl = require("../abl/devices/log-public-abl");
//
router.get("/ping", constants.authenticateToken, async (req, res) => {
    await PingDeviceAbl(req, res);
});

router.get("/log", async (req, res) => {
    await LogDeviceAbl(req, res);
});

router.get("/log-public", async (req, res) => {
    await LogPublicAbl(req, res);
});

module.exports = router;