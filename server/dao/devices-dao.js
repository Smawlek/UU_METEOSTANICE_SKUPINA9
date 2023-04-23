const crypto = require("crypto");
const mysql = require('mysql2/promise');
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
// Konstanty
const constants = require('../const');

class DevicesDao {
    async PingDevice(data) {
        try {
            const connection = await this._connectDBSync();

            let sql = `SELECT * 
                FROM devices
                WHERE id_de = ${data.device}`;
            let [res] = await connection.query(sql);

            connection.end();

            if(res.length > 0) return {response: true};

            return {response: false};
        } catch (error) {
            console.log(error);
        }
    }

    async LogDevice(data) {
        try {
            const pass = crypto.createHash('md5').update(data.password).digest("hex");
            const connection = await this._connectDBSync();

            let sql = `SELECT l.id_lo AS 'location_id', d.id_de AS 'device_id' 
                FROM locations l
                JOIN devices d ON d.id_de = l.device_id
                WHERE d.password = '${pass}' AND d.device = '${data.device}'`;
            let [res] = await connection.query(sql);

            connection.end();

            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async LogPublic(data) {
        try {
            const connection = await this._connectDBSync();

            let sql = `SELECT l.id_lo AS 'location_id', l.name AS 'location_name', d.id_de AS 'device_id' 
                FROM locations l
                JOIN devices d ON d.id_de = l.device_id
                WHERE l.publicToken = '${data.public_token}'`;
            let [res] = await connection.query(sql);

            connection.end();

            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async GetDeviceActivity(id) {
        try {
            const connection = await this._connectDBSync();

            let sql = `SELECT isActive 
                FROM devices
                WHERE id_de = ${id}`;
            let [res] = await connection.query(sql);

            connection.end();

            return res;
        } catch (error) {
            console.log(error);
        }
    }

    async ListUsersDevices(id) {
        try {
            const connection = await this._connectDBSync();

            let sql = `SELECT id_de AS 'device_id', device AS 'device_name', isActive,
                    (SELECT COUNT(id_lo) FROM locations WHERE device_id = 1) AS 'isConnected'
                FROM devices
                WHERE owner = ${id}`;
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

module.exports = DevicesDao;