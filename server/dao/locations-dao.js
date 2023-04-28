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

    async ListUsersLocations(id) {
        try {
            const connection = await this._connectDBSync();

            let sql = `SELECT l.id_lo AS 'location_id', l.device_id, d.device AS 'device_name', l.name, l.description, l.minTemp, l.maxTemp, l.notifyOnPhone, l.publicToken
                FROM locations l
                JOIN devices d ON d.id_de = l.device_id
                WHERE l.owner = ${id}`;
            let [res] = await connection.query(sql);

            connection.end();

            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async ChangePublicToken(id) {
        try {
            let length = 13,
                charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                retVal = "";

            for (let i = 0, n = charset.length; i < length; ++i) {
                retVal += charset.charAt(Math.floor(Math.random() * n));
            }

            const token = crypto.createHash('md5').update(retVal).digest("hex");
            const hash = crypto.createHash('md5').update(token).digest("hex");

            const connection = await this._connectDBSync();

            let sql = `UPDATE locations SET publicToken = '${hash}' WHERE id_lo = ${id}`;
            let [res] = await connection.query(sql);

            connection.end();

            return {publicToken: hash};
        } catch (error) {
            console.log(error);
        }
    }

    async ListUserPublickTokens(id) {
        try {
            const connection = await this._connectDBSync();

            let sql = `SELECT l.publicToken
            FROM locations l
            JOIN devices d ON d.id_de = l.device_id
            WHERE d.owner = ${id}`;
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