const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const MONGODB_URI = "mongodb://GiteshMedi:shastri1@ds263590.mlab.com:63590/medicento";
mongoose.connect(MONGODB_URI);
mongoose.Promise = global.Promise;

app.use(require('express-session')({
    secret: "Gitesh Secret Page",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get('/history', isLoggedIn , (req, res, next) => {
    res.render('history');
});

app.get('/orders', isLoggedIn, (req, res, next) => {
    res.render('orders');
});

app.get('/inventory', isLoggedIn , (req, res, next) => {
    res.render('inventory');
});

app.get('/addRetailer', isLoggedIn, (req, res, next) => {
    res.render('addRetailer');
});

app.get('/addDistributor', isLoggedIn , (req, res, next) => {
    res.render('addDistrbutor');
});

app.get('/resetPass', isLoggedIn, (req, res, next) => {
    res.render('resetPass');
});

app.get('/contact', isLoggedIn, (req, res, next) => {
    res.render('contact');
});

app.get('/addSalesPerson', isLoggedIn, (req, res, next) => {
    res.render('addSalesPerson');
});

app.get('/setting', isLoggedIn, (req, res, next) => {
    res.render('setting');
});

//User Routes for login,logout,signup and profile

app.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('profile');
});

app.get('/login', (req, res, next) => {
    res.render('profile-login');
});

app.post('/login', passport.authenticate("local", { successRedirect: "/" , failureRedirect: "/login"}), (req, res) => {
});

app.get('/signup', (req, res, next) => {
    res.render('pages-sign-up');
});

app.post('/signup', (req, res) => {
    const newUser = new User({
        username: req.body.nick,
        useremail: req.body.email
    });
    User.register(newUser, req.body.pass, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('pages-sign-up');
        }
            res.redirect('/profile');
           });
    });

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/forgot-password', (req, res, next) => {
    res.render('pages-forgot-password');
});


app.use('/', (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            res.render('index', { currentUser: req.user, count: docs.length });
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

module.exports = app;
