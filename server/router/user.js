const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
require('dotenv').config();
const loginChecker = require('../loginChecker.js');
const db = require('../db.js');

router.post('/login', passport.authenticate('local', {failureRedirect: '/user/fail'}), (req, res) => {
    console.log("[USER][LOGIN] | id : " + req.body.id);
    res.send(req.body.id);
});

router.get('/fail', (req, res) => {
    res.send(false);
});

router.get('/logout', loginChecker.isLogin, (req, res) => {
    console.log("[USER][LOGOUT] | id : " + req.user.id);

    req.logout((err) => {
        if (err) throw err;

        res.send(true);
    });
});

router.post('/signup', (req, res) => {
    let userInfo = {id: req.body.id, pw: bcrypt.hashSync(req.body.pw, 10)};

    // 중복 체크를 위해 id 검색
    db.client.collection(process.env.COLLECTION_USER).findOne({id: userInfo.id}, (err, findRes) => {
        if (err) throw err;

        if (!findRes) {
            // user 추가
            db.client.collection(process.env.COLLECTION_USER).insertOne(userInfo, (err, insertRes) => {
                if (err) throw err;

                // characters collection에 document 추가
                let emptyCharacter = {userId: userInfo.id, list: []};
                db.client.collection(process.env.COLLECTION_CHARACTER).insertOne(emptyCharacter, (err, insertCharRes) => {
                    if (err) throw err;

                    console.log("[USER][SIGNUP] | id : " + userInfo.id);
                    res.send(userInfo.id);
                });
            });
        } else {
            res.send(false);
        }
    });
});

router.delete('/', loginChecker.isLogin, async (req, res) => {
    try {
        // user 삭제
        await db.client.collection(process.env.COLLECTION_USER).deleteOne({id: req.user.id});

        // 모든 collection에서 삭제한 user의 document 삭제
        const collections = ["abyssDungeon", "abyssDungeonChallenge", "accessories", "chaosDungeon", "chaosGate", 
        "characters", "commander", "epona", "fieldBoss", "ghostShip", 
        "guardian", "guardianChallenge", "secretMap"];
        await Promise.all(collections.map(async (collection, i) => {
            await db.client.collection(collection).deleteMany({userId: req.user.id});
        }));

        console.log("[USER][DELETE] | " + req.user.id);
        res.send(req.user.id);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;