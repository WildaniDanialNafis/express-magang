const connection = require('../db');

class BeratBadan {
    constructor(id, beratBadan, userId, createdAt, updatedAt) {
        this.id = id;
        this.beratBadan = beratBadan;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static findAll(userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Berat_Badan WHERE userId =? ORDER BY id DESC';
            connection.query(query, [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results.map(beratBadan => new BeratBadan(beratBadan.id, beratBadan.beratBadan, beratBadan.userId, beratBadan.createdAt, beratBadan.updatedAt)));
            });
        });
    }

    static create(beratBadan, userId) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO Berat_Badan (beratBadan, userId, createdAt, updatedAt) VALUES (?,?, NOW(), NOW())';
            connection.query(query, [beratBadan, userId], (err, results) => {
                if (err) reject(err);
                else resolve(new BeratBadan(results.insertId, beratBadan, userId, new Date(), new Date()));
            });
        });
    }

    static update(id, beratBadan, userId, createdAt) {
        return new Promise(function(resolve, reject) {
            const query = 'UPDATE Berat_Badan SET beratBadan =?, updatedAt =? WHERE id =? AND userId =?';
            connection.query(query, [beratBadan, new Date(), id, userId], (err, results) => {
                if (err) reject(err);
                else resolve(new BeratBadan(parseInt(id), beratBadan, userId, createdAt, new Date()));
            });
        });
    }

    static delete(id, userId) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM Berat_Badan WHERE id = ? AND userId = ?';
            connection.query(query, [id, userId], (err, results) => {
                if (err) reject(err);
                else resolve(results.affectedRows === 1);
            });
        });
    }

    static findById(id, userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Berat_Badan WHERE id =? AND userId = ?';
            connection.query(query, [id, userId], (err, results) => {
                if (err) reject(err);
                else resolve(results.length? new BeratBadan(results[0].id, results[0].beratBadan, results[0].userId, results[0].createdAt, results[0].updatedAt) : null);
            });
        });
    }
}

module.exports = BeratBadan;