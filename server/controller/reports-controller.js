const express = require("express");

const router = express.Router();
// Konstanty
const constants = require('../const');
// ABL
const AddReportAbl = require("../abl/reports/add-report-abl");
const GetReportsByDatesAbl = require("../abl/reports/get-by-dates-abl");
//
router.post("/add", constants.authenticateToken, async (req, res) => {
    await AddReportAbl(req, res);
});

router.get("/get-by-dates", constants.authenticateToken, async (req, res) => {
    await GetReportsByDatesAbl(req, res);
});

module.exports = router;