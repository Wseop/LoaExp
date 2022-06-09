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
app.use('/abyssDungeon', require('./router/abyssDungeon.js'));
app.use('/chaosDungeon', require('./router/chaosDungeon.js'));
app.use('/chaosGate', require('./router/chaosGate.js'));
app.use('/commander', require('./router/commander.js'));
app.use('/epona', require('./router/epona.js'));
app.use('/fieldBoss', require('./router/fieldBoss.js'));
app.use('/ghostShip', require('./router/ghostShip.js'));
app.use('/guardian', require('./router/guardian.js'));
app.use('/secretMap', require('./router/secretMap.js'));

app.listen(process.env.PORT, () => {
    console.log("Listening on " + process.env.PORT);
});