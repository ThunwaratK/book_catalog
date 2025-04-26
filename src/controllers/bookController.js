const BookModel = require('../models/bookModel');
const { v4: uuidv4 } = require('uuid');

class BookController {
    constructor() {
        this.bookModel = null;
    }
    
    initialize(client) {
        this.bookModel = new BookModel(client);
        // Create books table if it doesn't exist
        this.bookModel.createTable()
            .then(() => console.log('Books table ready'))
            .catch(err => console.error('Error creating books table:', err));
    }

    async addBook(req, res) {
        const { title, author, status, note } = req.body;
        const userId = req.session.user.id;
        
        try {
            await this.bookModel.addBook({ 
                user_id: userId,
                book_id: uuidv4(),
                title, 
                author, 
                status, 
                note 
            });
            res.redirect('/api/books');
        } catch (error) {
            console.error('Error adding book:', error);
            res.status(500).send('Error adding book');
        }
    }

    async getBooks(req, res) {
        const userId = req.session.user.id;
        
        try {
            const books = await this.bookModel.getBooks(userId);
            res.render('books/list', { books, title: "My Books" });
        } catch (error) {
            console.error('Error retrieving books:', error);
            res.status(500).send('Error retrieving books');
        }
    }

    async editBook(req, res) {
        const { id } = req.params;
        const userId = req.session.user.id;
        
        try {
            const book = await this.bookModel.getBookById(userId, id);
            if (!book) {
                return res.status(404).send('Book not found');
            }
            res.render('books/edit', { book });
        } catch (error) {
            console.error('Error retrieving book:', error);
            res.status(500).send('Error retrieving book');
        }
    }

    async updateBook(req, res) {
        const { id } = req.params;
        const { title, author, status, note } = req.body;
        const userId = req.session.user.id;
        
        try {
            await this.bookModel.updateBook(userId, id, { 
                title, 
                author, 
                status, 
                note 
            });
            res.redirect('/api/books');
        } catch (error) {
            console.error('Error updating book:', error);
            res.status(500).send('Error updating book');
        }
    }

    async deleteBook(req, res) {
        const { id } = req.params;
        const userId = req.session.user.id;
        
        try {
            await this.bookModel.deleteBook(userId, id);
            res.redirect('/api/books');
        } catch (error) {
            console.error('Error deleting book:', error);
            res.status(500).send('Error deleting book');
        }
    }
}

module.exports = BookController;