const crypto = require("crypto");
const mysql = require('mysql2/promise');
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
// Konstanty
const constants = require('../const');

class LocationsDao {
    async GetLocationByDevice(id) {
        try {
            const connection = await this._connectDBSync();

            let sql = `SELECT l.id_lo AS 'location_id'
                FROM locations l
                WHERE l.device_id = '${id}'`;
            let [res] = await connection.query(sql);

            connection.end();

            return res;
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

module.exports = LocationsDao;