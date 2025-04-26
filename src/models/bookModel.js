const { v4: uuidv4 } = require('uuid');

class BookModel {
    constructor(client) {
        this.client = client;
        this.tableName = 'books';
    }

    async createTable() {
        const query = `CREATE TABLE IF NOT EXISTS ${this.tableName} (
            user_id UUID,
            book_id UUID,
            title TEXT,
            author TEXT,
            status TEXT,
            note TEXT,
            PRIMARY KEY ((user_id), book_id)
        )`;
        await this.client.execute(query);
    }

    async addBook(book) {
        if (!book.book_id) {
            book.book_id = uuidv4();
        }
        
        const query = `INSERT INTO ${this.tableName} (user_id, book_id, title, author, status, note) 
                       VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [
            book.user_id, 
            book.book_id, 
            book.title, 
            book.author, 
            book.status, 
            book.note || null
        ];
        
        await this.client.execute(query, params, { prepare: true });
        return book;
    }

    async getBooks(userId) {
        const query = `SELECT * FROM ${this.tableName} WHERE user_id = ?`;
        const result = await this.client.execute(query, [userId], { prepare: true });
        return result.rows;
    }
    
    async getBookById(userId, bookId) {
        const query = `SELECT * FROM ${this.tableName} WHERE user_id = ? AND book_id = ?`;
        const result = await this.client.execute(query, [userId, bookId], { prepare: true });
        return result.rows[0];
    }

    async updateBook(userId, bookId, updatedBook) {
        const query = `UPDATE ${this.tableName} 
                       SET title = ?, author = ?, status = ?, note = ? 
                       WHERE user_id = ? AND book_id = ?`;
        const params = [
            updatedBook.title, 
            updatedBook.author, 
            updatedBook.status, 
            updatedBook.note || null,
            userId,
            bookId
        ];
        
        await this.client.execute(query, params, { prepare: true });
    }

    async deleteBook(userId, bookId) {
        const query = `DELETE FROM ${this.tableName} WHERE user_id = ? AND book_id = ?`;
        await this.client.execute(query, [userId, bookId], { prepare: true });
    }
}

module.exports = BookModel;