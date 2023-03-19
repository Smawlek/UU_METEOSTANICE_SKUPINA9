const express = require("express");

const router = express.Router();
// Konstanty
const constants = require('../const');
// ABL
const AddReportAbl = require("../abl/reports/add-report-abl");

router.post("/add", constants.authenticateToken, async (req, res) => {
    await AddReportAbl(req, res);
});

module.exports = router;