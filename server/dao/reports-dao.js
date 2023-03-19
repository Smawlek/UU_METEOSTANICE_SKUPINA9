const mysql = require('mysql2/promise');
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
// Konstanty
const constants = require('../const');

class ReportsDao {
    async AddReport(data) {
        try {
            const connection = await this._connectDBSync();

            let sql = `INSERT INTO reports(id_re, location_id, temperature, humidity, date)
                VALUES(NULL, ${data.location}, ${data.temperature}, ${data.humidity}, '${data.date}')`;
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