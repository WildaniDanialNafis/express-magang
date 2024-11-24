const connection = require('../db');

class TekanaDarah  {
    constructor(id, sistolik, diastolik, userId, createdAt, updatedAt) {
        this.id = id;
        this.sistolik = sistolik;
        this.diastolik = diastolik;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static findAll(userId) {
        return new Promise ((resolve, reject) => {
            const query = 'SELECT * FROM Tekanan_Darah WHERE userId =? ORDER BY id DESC';
            connection.query(query, [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results.map(tekananDarah => new TekanaDarah(tekananDarah.id, tekananDarah.sistolik, tekananDarah.diastolik, tekananDarah.userId, tekananDarah.createdAt, tekananDarah.updatedAt)));
            });
        });
    }

    static create(sistolik, diastolik, userId) {
        return new Promise ((resolve, reject) => {
            const query = 'INSERT INTO Tekanan_Darah (sistolik, diastolik, userId, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())';
            connection.query(query, [sistolik, diastolik, userId], (err, results) => {
                if (err) reject(err);
                else resolve(new TekanaDarah(results.insertId, sistolik, diastolik, userId, new Date(), new Date()));
            });
        });
    }

    static update(id, sistolik, diastolik, userId, createdAt) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE Tekanan_Darah SET sistolik =?, diastolik =?, updatedAt =? WHERE id =? AND userId =?';
            connection.query(query, [sistolik, diastolik, new Date(), id, userId], (err, results) => {
                if (err) reject(err);
                else resolve(new TekanaDarah(parseInt(id), sistolik, diastolik, userId, createdAt, new Date()));
            });
        });
    }

    static delete(id, userId) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM Tekanan_Darah WHERE id =? AND userId =?';
            connection.query(query, [id, userId], (err, results) => {
                if (err) reject(err);
                else resolve(results.affectedRows === 1);
            });
        });
    }

    static findById(id, userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Tekanan_Darah WHERE id =? AND userId =?';
            connection.query(query, [id, userId], (err, results) => {
                if (err) reject(err);
                else resolve(results.length > 0? new TekanaDarah(results[0].id, results[0].sistolik, results[0].diastolik, results[0].userId, results[0].createdAt, results[0].updatedAt) : null);
            });
        });
    }
}   

module.exports = TekanaDarah;