const express = require('express');
const BookController = require('../controllers/bookController');

const router = express.Router();
const bookController = new BookController();

function setRoutes(app) {
    // Initialize the book controller with Cassandra client
    bookController.initialize(app.locals.cassandra);
    
    router.get('/books/add', (req, res) => res.render('books/add'));
    router.post('/books', bookController.addBook.bind(bookController));
    router.get('/books', bookController.getBooks.bind(bookController));
    router.get('/books/edit/:id', bookController.editBook.bind(bookController));
    router.post('/books/edit/:id', bookController.updateBook.bind(bookController));
    router.get('/books/delete/:id', bookController.deleteBook.bind(bookController));
    
    app.use('/api', router);
}

module.exports = setRoutes;