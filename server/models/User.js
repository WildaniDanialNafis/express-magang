const connection = require('../db');

class User {
    constructor(id, email, password, createdAt, upatedAt) {
        this.id = id,
        this.email = email,
        this.password = password,
        this.createdAt = createdAt,
        this.upatedAt = upatedAt
    }

    static findUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * from Users WHERE email = ?`;
            connection.query(query, [email], (err, results) => {
                console.log(results);
                if(err) reject(err);
                else resolve(results.length ? new User(results[0].id, results[0].email, results[0].password, results[0].createdAt, results[0].updatedAt) : null);
            });
        });
    }
}

module.exports = User;