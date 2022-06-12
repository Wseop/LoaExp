const express = require('express');
const router = express.Router();
require('dotenv').config();
const loginChecker = require('../loginChecker.js');
const db = require('../db.js');
const ObjectId = require('mongodb').ObjectId;

// 전체 조회
router.get('/', loginChecker.isLogin, (req, res) => {
    db.client.collection(process.env.COLLECTION_GUARDIAN).find({userId: req.user.id}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[GUARDIAN][READ]");
    });
});

// 캐릭터명으로 조회
router.get('/character', loginChecker.isLogin, (req, res) => {
    db.client.collection(process.env.COLLECTION_GUARDIAN).find({userId: req.user.id, character: req.body.character}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[GUARDIAN][READ][CHARACTER]");
    });
});

// 날짜로 조회
router.get('/date', loginChecker.isLogin, (req, res) => {
    db.client.collection(process.env.COLLECTION_GUARDIAN).find({userId: req.user.id, year: req.body.year, ww: req.body.ww}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[GUARDIAN][READ][DATE]");
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
    newItems.destruction = req.body.destruction;
    newItems.protection = req.body.protection;
    newItems.leapStone = req.body.leapStone;
    newDocument.items = newItems;

    db.client.collection(process.env.COLLECTION_GUARDIAN).insertOne(newDocument, (err, insertRes) => {
        if (err) throw err;

        newDocument._id = insertRes.insertedId;
        res.send(newDocument);

        console.log("[GUARDIAN][CREATE]");
    });
});

// 데이터 수정 (by ObjectId)
router.put('/', loginChecker.isLogin, (req, res) => {
    // 새 데이터 세팅
    let newDocument = {};
    newDocument.userId = req.user.id;
    newDocument.character = req.body.character;
    newDocument.year = req.body.year;
    newDocument.ww = req.body.ww;
    newDocument.stage = req.body.stage;
    let newItems = {};
    newItems.destruction = req.body.destruction;
    newItems.protection = req.body.protection;
    newItems.leapStone = req.body.leapStone;
    newDocument.items = newItems;

    db.client.collection(process.env.COLLECTION_GUARDIAN).updateOne({_id: ObjectId(req.body._id)}, {$set: newDocument}, (err, updateRes) => {
        if (err) throw err;

        newDocument._id = req.body._id;
        res.send(newDocument);

        console.log("[GUARDIAN][UPDATE]");
    });
});

// 데이터 삭제 (by ObjectId)
router.delete('/', loginChecker.isLogin, (req, res) => {
    db.client.collection(process.env.COLLECTION_GUARDIAN).deleteOne({_id: ObjectId(req.body._id)}, (err, deleteRes) => {
        if (err) throw err;

        res.send(req.body._id);

        console.log("[GUARDIAN][DELETE]");
    });
});

module.exports = router;