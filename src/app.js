const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Client } = require('cassandra-driver');
const setBookRoutes = require('./routes/bookRoutes');
const setAuthRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 3000;

// Configure session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

const client = new Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1',
  keyspace: 'book_catalog',
  credentials: {
    username: 'admin',
    password: 'admin1234',
  },
});

client.connect()
  .then(() => {
    console.log('Connected to Cassandra');
  })
  .catch(err => {
    console.error('Failed to connect to Cassandra', err);
  });

// Make client available to routes
app.locals.cassandra = client;

// Auth routes (available to all)
setAuthRoutes(app);

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/api/books');  // Redirect to books if logged in
  } else {
    res.redirect('/auth/login');  // Redirect to login if not logged in
  }
});

// Protect book routes with authentication
app.use('/api', isAuthenticated);

// Book routes
setBookRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

