require('dotenv').config()
require('./DB/connection')

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session')
var indexRouter = require('./routes/index');


const flash = require('connect-flash')
const passport = require('passport');
const { log } = require('console');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: 'Dev Dev Dev'
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.listen(3000, ()=>{
    console.log('app listining on'+ 3000);
})