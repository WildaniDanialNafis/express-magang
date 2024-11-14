// /models/MobileUser.js
const connection = require('../db');  // Impor koneksi ke database

class MobileUser {
    constructor(id, email, password, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static findAll() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Mobile_Users'; 
            connection.query(query, (err, results) => {
                if (err) reject(err);
                else resolve(results.map(user => new MobileUser(user.id, user.email, user.password, user.createdAt, user.updatedAt)));
            });
        });
    }

    static create(email, password) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO Mobile_Users (email, password, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())`;
            const values = [email, password];
            connection.query(query, values, (err, results) => {
                if (err) reject(err);
                else resolve(new MobileUser(results.insertId, email, password, new Date(), new Date()));
            });
        });
    }


    static findById(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM Mobile_Users WHERE id = ?`;
            connection.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results.length ? new MobileUser(results[0].id, results[0].email, results[0].password, results[0].createdAt, results[0].updatedAt) : null);
            });
        });
    }

    static update(id, email, password, createdAt) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE Mobile_Users SET email = ?, password = ?, updatedAt = NOW() WHERE id = ?`;
            connection.query(query, [email, password, id], (err, results) => {
                if (err) reject(err);
                else resolve(new MobileUser(id, email, password, createdAt, new Date()));
            });
        });
    }

    static deleteById(id) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM Mobile_Users WHERE id = ?`;
            connection.query(query, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results.affectedRows > 0);
            });
        });
    }
}

module.exports = MobileUser;
