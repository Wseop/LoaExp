const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const db = require('./db.js');

module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log("[PASSPORT][SERIALIZE] | _id : " + user._id);
        done(null, user._id);
    });
    
    passport.deserializeUser((id, done) => {
        db.client.collection(process.env.COLLECTION_USER).findOne({_id: ObjectId(id)}, (err, user) => {
            if (err) throw err;

            console.log("[PASSPORT][DESERIALIZE] | _id : " + id);
            console.log("[PASSPORT][DESERIALIZE] | user : " + user);
            done(null, user);
        });
    });
    
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pw',
        session: true,
        passReqToCallback: false,
    }, (id, pw, done) => {
        db.client.collection(process.env.COLLECTION_USER).findOne({id: id}, (err, res) => {
            if (err) return done(err);
    
            if (!res) return done(null, false, {message: "존재하지 않는 ID입니다."});
            if (bcrypt.compareSync(pw, res.pw)) {
                return done(null, res);
            } else {
                return done(null, false, {message: "비밀번호가 일치하지 않습니다."});
            }
        });
    }));
};