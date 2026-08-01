const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // Load variables from .env

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));

// Sessions (used for organizer login)
app.use(session({
  secret: process.env.SESSION_SECRET || 'mahapath-dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// Make the logged-in user available in every view as `currentUser`
const { attachUser } = require('./middleware/auth');
app.use(attachUser);

// Routes
const mainRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
app.use('/', mainRoutes);
app.use('/', authRoutes);

// 404 handler — must come after all real routes
app.use((req, res) => {
  res.status(404).render('404');
});

// Generic error handler — catches anything thrown/rejected in routes
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).render('error', { message: 'Something went wrong on our end.' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
