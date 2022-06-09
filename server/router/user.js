const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
require('dotenv').config();
const loginChecker = require('../loginChecker.js');
const db = require('../db.js');

router.post('/login', passport.authenticate('local', {failureRedirect: '/user/fail'}), (req, res) => {
    console.log("[USER][LOGIN] | id : " + req.body.id);
    res.send("로그인 성공");
});

router.get('/fail', (req, res) => {
    res.send("로그인 실패");
});

router.get('/logout', loginChecker.isLogin, (req, res) => {
    console.log("[USER][LOGOUT] | id : " + req.user.id);

    req.logout((err) => {
        if (err) throw err;

        res.send("로그아웃");
    });
});

router.post('/signup', (req, res) => {
    let userInfo = {id: req.body.id, pw: bcrypt.hashSync(req.body.pw, 10)};

    db.client.collection(process.env.COLLECTION_USER).findOne({id: userInfo.id}, (err, findRes) => {
        if (err) throw err;

        if (!findRes) {
            db.client.collection(process.env.COLLECTION_USER).insertOne(userInfo, (err, insertRes) => {
                if (err) throw err;

                console.log("[USER][SIGNUP] | id : " + userInfo.id);
                res.send("회원가입 성공");
            });
        } else {
            res.send("회원가입 실패(이미 존재하는 id)");
        }
    });
});

module.exports = router;