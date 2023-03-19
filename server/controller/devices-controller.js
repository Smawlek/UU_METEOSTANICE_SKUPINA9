const express = require("express");

const router = express.Router();
// Konstanty
const constants = require('../const');
// ABL
const PingDeviceAbl = require("../abl/devices/ping-device-abl");
const LogDeviceAbl = require("../abl/devices/log-device-abl");

router.get("/ping", constants.authenticateToken, async (req, res) => {
    await PingDeviceAbl(req, res);
});

router.get("/log", async (req, res) => {
    await LogDeviceAbl(req, res);
});

module.exports = router;