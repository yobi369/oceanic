const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

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

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});


app.post('/send-message', (req, res) => {
    const { name, email, message } = req.body;
    // Here you can process the message, e.g., send an email or save to a database
    console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
    res.send('Message sent successfully!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});