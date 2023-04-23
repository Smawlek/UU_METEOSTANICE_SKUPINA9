const mysql = require('mysql2/promise');
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(express.json());
app.use(cors());
// Konstanty
const constants = require('../const');

class UsersDao {
    async LoginUser(user) {
        try {
            const connection = await this._connectDBSync();
    
            const pass = crypto.createHash('md5').update((user.password).trim()).digest("hex");
            let sql = `SELECT id_us AS 'id', name, role, email FROM users WHERE email = '${user.email}' AND password = '${pass}'`;

            let [res] = await connection.query(sql);
    
            connection.end();
    
            return res;
        } catch (error) {
            console.log(error)
        }
    }

    async ChangePassword(body, id) {
        try {
            connection = await this._connectDBSync();

            let pass = crypto.createHash('md5').update(body.old_pass).digest("hex");
            let new_pass = crypto.createHash('md5').update(body.new_pass).digest("hex");

            let sql = `SELECT password FROM users WHERE id_us = ${id}`;
            let [response] = await connection.query(sql);

            if (pass === response[0].password) {
                sql = `UPDATE users u SET u.password = '${new_pass}' WHERE id_us = ${id}`;
                [response] = await connection.query(sql);

                connection.end();

                return JSON.stringify(response);
            }

            connection.end();

            return JSON.stringify({ error: 401 });
        } catch (error) {
            console.log(error)
        }
    }

    async GetUsersInfo(id) {
        try {
            const connection = await this._connectDBSync();
    
            let sql = `SELECT u.id_us AS 'user_id', u.name AS 'user_name', u.email, u.role, r.name AS 'role_name',
			            (SELECT COUNT(id_de) FROM devices WHERE owner = u.id_us) AS 'devices_count',
                        (SELECT COUNT(id_lo) FROM locations WHERE owner = u.id_us) AS 'locations_count'
		            FROM users u
                    JOIN roles r ON r.id_ro = u.role
                    WHERE u.id_us = ${id}`;

            let [res] = await connection.query(sql);
    
            connection.end();
    
            return res;
        } catch (error) {
            console.log(error)
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

module.exports = UsersDao;