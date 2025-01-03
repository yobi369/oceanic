const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Mock user database
const users = [];

// Passport configuration
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) return done(null, false);
    bcrypt.compare(password, user.password, (err, res) => {
        if (res) return done(null, user);
        return done(null, false);
    });
}));

passport.serializeUser ((user, done) => {
    done(null, user.username);
});

passport.deserializeUser ((username, done) => {
    const user = users.find(u => u.username === username);
    done(null, user);
});

// Registration route
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        users.push({ username, password: hash });
        res.send('User  registered successfully!');
    });
});

// Login route
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs file
});

app.get('/volunteer', (req, res) => {
    res.render('volunteer'); // Ensure this file exists in the views directory
});

app.post('/send-message', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
    res.send('Message sent successfully!');
});
 
// About routes
app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/features', (req, res) => {
    res.render('features');
});

app.get('/blog', (req, res) => {
    res.render('blog');
});

// Company routes
app.get('/team', (req, res) => {
    res.render('team');
});

app.get('/donations', (req, res) => {
    res.render('donations');
});

// Support routes
app.get('/faqs', (req, res) => {
    res.render('faqs');
});

app.get('/support', (req, res) => {
    res.render('support');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

// Legal routes
app.get('/terms', (req, res) => {
    res.render('terms');
});

app.get('/privacy', (req, res) => {
    res.render('privacy');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});