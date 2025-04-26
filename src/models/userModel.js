const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class UserModel {
    constructor(client) {
        this.client = client;
        this.tableName = 'users';
    }

    async createTable() {
        const query = `
        CREATE TABLE IF NOT EXISTS ${this.tableName} (
            id UUID PRIMARY KEY,
            username TEXT,
            email TEXT,
            password TEXT
        )`;
        await this.client.execute(query);
        
        // Create an index on email for login queries
        const indexQuery = `
        CREATE INDEX IF NOT EXISTS ON ${this.tableName} (email)`;
        await this.client.execute(indexQuery);
    }

    async registerUser(username, email, password) {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Generate UUID for user
        const id = uuidv4();
        
        const query = `INSERT INTO ${this.tableName} (id, username, email, password) VALUES (?, ?, ?, ?)`;
        const params = [id, username, email, hashedPassword];
        
        await this.client.execute(query, params, { prepare: true });
        return { id, username, email };
    }
    
    async getUserByEmail(email) {
        const query = `SELECT * FROM ${this.tableName} WHERE email = ? ALLOW FILTERING`;
        const result = await this.client.execute(query, [email], { prepare: true });
        return result.rows[0];
    }
    
    async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = UserModel;