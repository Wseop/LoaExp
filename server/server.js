const express = require('express');
const app = express();
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport.js');
require('dotenv').config();

app.use(compression());
app.use(cors({origin: process.env.URL_CLIENT, credentials: true}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// passport
app.use(session({secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

// router
app.use('/user', require('./router/user.js'));
app.use('/characters', require('./router/characters.js'));
app.use('/rewards', require('./router/rewards.js'));
app.use('/accessory', require('./router/accessory.js'));

app.listen(process.env.PORT, () => {
    console.log("Listening on " + process.env.PORT);
});