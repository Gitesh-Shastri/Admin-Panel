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

app.get('/profile', (req, res, next) => {
    res.render('profile');
});

app.get('/pages-login', (req, res, next) => {
    res.render('profile-login');
});

app.get('/history', (req, res, next) => {
    res.render('history');
});

app.get('/orders', (req, res, next) => {
    res.render('orders');
});

app.get('/inventory', (req, res, next) => {
    res.render('inventory');
});

app.get('/addRetailer', (req, res, next) => {
    res.render('addRetailer');
});

app.get('/addDistributor', (req, res, next) => {
    res.render('addDistrbutor');
});

app.get('/resetPass', (req, res, next) => {
    res.render('resetPass');
});

app.get('/contact', (req, res, next) => {
    res.render('contact');
});

app.get('/addSalesPerson', (req, res, next) => {
    res.render('addSalesPerson');
});

app.get('/setting', (req, res, next) => {
    res.render('setting');
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
app.use('/pages-forgot-password', (req, res, next) => {
    res.render('pages-forgot-password');
});

app.use('/', (req, res, next) => {
    res.render('index', {user_name: "Gitesh Shastri" });
});


module.exports = app;