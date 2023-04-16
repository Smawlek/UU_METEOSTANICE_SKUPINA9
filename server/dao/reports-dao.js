const mysql = require('mysql2/promise');
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
// Konstanty
const constants = require('../const');

class ReportsDao {
    async AddReport(data, location_id) {
        try {
            const connection = await this._connectDBSync();

            let sql = `INSERT INTO reports(id_re, location_id, temperature, humidity, date)
                VALUES(NULL, ${location_id}, ${data.temperature}, ${data.humidity}, '${data.date}')`;
            let [res] = await connection.query(sql);

            connection.end();

            return JSON.stringify(res);
        } catch (error) {
            console.log(error);
        }
    }

    async GetReportsByDates(data, location_id) {
        try {
            const limit = data.granularity === NaN ? 999 : data.granularity === 0 ? 12 : data.granularity === 1 ? 360 : data.granularity === 2 ? 840 : data.granularity === 3 ? 1680 : data.granularity === 4 ? 3600 : 10800;
            const connection = await this._connectDBSync();

            let sql = `SELECT * 
                FROM reports
                WHERE location_id = ${location_id} && date >= '${(data.start).trim() + ' 00:00:00'}' && date <= '${(data.end).trim() + ' 23:59:59'}'
                ORDER BY date ASC
                LIMIT ${limit}`;
                console.log(sql)
            let [res] = await connection.query(sql);

            connection.end();

            return JSON.stringify(res);
        } catch (error) {
            console.log(error);
        }
    }

    async _connectDBSync() {
        let connectionSync = mysql.createPool(
            {
                host: constants.DB_HOST,
                user: constants.DB_USER,
                password: constants.DB_PWD,
                database: constants.DB_NAME
            }
        )

        return connectionSync;
    }
}

module.exports = ReportsDao;