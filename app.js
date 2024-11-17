const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/Auth'); // Adjust if the path is different
const portfolioRoutes = require('./routes/portfolio');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', 'views'); // This should match where your EJS views are stored
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // This ensures you can parse JSON bodies

// Passport.js setup
require('./config/passportConfig')(passport);
app.use(session({
  secret: process.env.SESSION_SECRET, // Ensure you have this variable in your .env file
  resave: false,
  saveUninitialized: false, // This prevents creating sessions for unauthenticated users
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes); // Handle authentication routes
app.use('/portfolio', portfolioRoutes); // Handle portfolio routes

// Home route (default redirection to register page)
app.get('/', (req, res) => res.redirect('/auth/register'));

// Ensure to add a catch-all error handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).render('404', { message: 'Page not found' }); // Create a 404.ejs for this
});


// Error handling middleware for general errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
