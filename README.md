# Project Title: ProjectDB

## Description
ProjectDB is a web application that allows users to store and manage book data. Users can input details about books, select their reading status (unread or finished), and view a list of all books stored in the database.

## Technologies Used
- Node.js
- Express.js
- Cassandra
- Docker
- EJS (Embedded JavaScript templating)
- CSS

## Project Structure
```
projectdb
├── src
│   ├── app.js
│   ├── controllers
│   │   └── bookController.js
│   ├── models
│   │   └── bookModel.js
│   ├── routes
│   │   └── bookRoutes.js
│   └── views
│       ├── books
│       │   ├── add.ejs
│       │   ├── list.ejs
│       │   └── edit.ejs
│       └── layouts
│           └── main.ejs
├── public
│   ├── css
│   │   └── style.css
│   └── js
│       └── main.js
├── config
│   └── database.js
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd projectdb
   ```

2. Build and run the Docker containers:
   ```
   docker-compose up --build
   ```

3. Access the application:
   Open your web browser and navigate to `http://localhost:3000`.

## Usage
- To add a new book, navigate to the "Add Book" page and fill out the form.
- To view all books, go to the "List Books" page.
- You can edit or delete books from the list.

## License
This project is licensed under the ISC License.