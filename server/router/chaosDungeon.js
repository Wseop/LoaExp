const express = require('express');
const router = express.Router();
require('dotenv').config();
const loginChecker = require('../loginChecker.js');
const db = require('../db.js');
const ObjectId = require('mongodb').ObjectId;

// 전체 조회
router.get('/', loginChecker.isLogin, (req, res) => {
    db.client.collection(process.env.COLLECTION_CHAOSDUNGEON).find({userId: req.user.id}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[CHAOSDUNGEON][GET]");
    });
});

// 해당 캐릭터로 조회
router.get('/character', loginChecker.isLogin, (req, res) => {
    db.client.collection(process.env.COLLECTION_CHAOSDUNGEON).find({userId: req.user.id, character: req.body.character}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[CHAOSDUNGEON][GET][CHARACTER]");
    });
});

// 날짜로 조회
router.get('/date', loginChecker.isLogin, (req, res) => {
    db.client.collection(process.env.COLLECTION_CHAOSDUNGEON).find({userId: req.user.id, year: req.body.year, ww: req.body.ww}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[CHARACTER][GET][DATE]");
    });
});

// 데이터 추가
router.post('/', loginChecker.isLogin, (req, res) => {
    // 추가할 데이터 세팅
    let newDocument = {};
    newDocument.userId = req.user.id;
    newDocument.character = req.body.character;
    newDocument.year = req.body.year;
    newDocument.ww = req.body.ww;
    newDocument.stage = req.body.stage;
    let newItems = {};
    newItems.silling = req.body.silling;
    newItems.gold = req.body.gold;
    newItems.honorShard = req.body.honorShard;
    newItems.destruction = req.body.destruction;
    newItems.protection = req.body.protection;
    newItems.leapStone = req.body.leapStone;
    newItems.ticket = req.body.ticket;
    newItems.jewel = req.body.jewel;
    newDocument.items = newItems;
    
    db.client.collection(process.env.COLLECTION_CHAOSDUNGEON).insertOne(newDocument, (err, insertRes) => {
        if (err) throw err;

        res.send(newDocument);

        console.log("[CHARACTER][ADD]");
    });
});

// 데이터 수정 (by _id)
router.put('/', loginChecker.isLogin, (req, res) => {
    // 새 데이터 세팅
    let newDocument = {};
    newDocument.userId = req.user.id;
    newDocument.character = req.body.character;
    newDocument.year = req.body.year;
    newDocument.ww = req.body.ww;
    newDocument.stage = req.body.stage;
    let newItems = {};
    newItems.silling = req.body.silling;
    newItems.gold = req.body.gold;
    newItems.honorShard = req.body.honorShard;
    newItems.destruction = req.body.destruction;
    newItems.protection = req.body.protection;
    newItems.leapStone = req.body.leapStone;
    newItems.ticket = req.body.ticket;
    newItems.jewel = req.body.jewel;
    newDocument.items = newItems;

    db.client.collection(process.env.COLLECTION_CHAOSDUNGEON).updateOne({_id: ObjectId(req.body._id)}, {$set: newDocument}, (err, updateRes) => {
        if (err) throw err;

        res.send(newDocument);

        console.log("[CHARACTER][EDIT]");
    });
});

// 데이터 삭제 (by _id)
router.delete('/', loginChecker.isLogin, (req, res) => {
    db.client.collection(process.env.COLLECTION_CHAOSDUNGEON).deleteOne({_id: ObjectId(req.body._id)}, (err, deleteRes) => {
        if (err) throw err;

        res.send(true);

        console.log("[CHARACTER][DELETE]");
    });
});

module.exports = router;