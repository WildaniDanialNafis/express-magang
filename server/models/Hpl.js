const connection = require('../db');

class Hpl {
    constructor(id, hpl, usiaMinggu, usiaHari, sisaMinggu, sisaHari, userId, createdAt, updatedAt) {
        this.id = id;
        this.hpl = hpl;
        this.usiaMinggu = usiaMinggu;
        this.usiaHari = usiaHari;
        this.sisaMinggu = sisaMinggu;
        this.sisaHari = sisaHari;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static findAll(userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Data_Hpl WHERE userId = ?';
            connection.query(query, [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results.length ? new Hpl(results[0].id, results[0].hpl, results[0].usiaMinggu, results[0].usiaHari, 
                    results[0].sisaMinggu, results[0].sisaHari, results[0].userId, 
                    results[0].createdAt, results[0].updatedAt) : null);
            });
        });
    }

    static create(hpl, usiaMinggu, usiaHari, sisaMinggu, sisaHari, userId) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO Data_Hpl (hpl, usiaMinggu, usiaHari, sisaMinggu, sisaHari, userId, createdAt, updatedAt) VALUES (?,?,?,?,?,?, NOW(), NOW())';
            connection.query(query, [hpl, usiaMinggu, usiaHari, sisaMinggu, sisaHari, userId], (err, results) => {
                if (err) reject(err);
                else resolve(new Hpl(results.insertId,...arguments, new Date(), new Date()));
            });
        });
    }
}

module.exports = Hpl;
