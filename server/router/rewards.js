const express = require('express');
const router = express.Router();
require('dotenv').config();
const documentSetter = require('../utils/documentSetter.js');
const loginChecker = require('../loginChecker.js');
const db = require('../db.js');
const ObjectId = require('mongodb').ObjectId;

// 전체 조회
router.get('/:type', loginChecker.isLogin, (req, res) => {
    db.client.collection(req.params.type).find({userId: req.user.id}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[READ] | " + req.params.type);
    });
});

// 캐릭터명으로 조회
router.get('/:type/character', loginChecker.isLogin, (req, res) => {
    db.client.collection(req.params.type).find({userId: req.user.id, character: req.body.character}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[READ][CHARACTER] | " + req.params.type);
    });
});

// 날짜로 조회
router.get('/:type/date', loginChecker.isLogin, (req, res) => {
    db.client.collection(req.params.type).find({userId: req.user.id, year: req.body.year, ww: req.body.ww}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[READ][DATE] | " + req.params.type);
    });
});

// 데이터 추가
router.post('/:type', loginChecker.isLogin, async (req, res) => {
    let newDocument = await documentSetter.set(req.params.type, req.user.id, req.body);

    db.client.collection(req.params.type).insertOne(newDocument, (err, insertRes) => {
        if (err) throw err;

        newDocument._id = insertRes.insertedId;
        res.send(newDocument);

        console.log("[CREATE] | " + req.params.type);
    });
});

// 데이터 수정
router.put('/:type', loginChecker.isLogin, async (req, res) => {
    let newDocument = await documentSetter.set(req.params.type, req.user.id, req.body);

    db.client.collection(req.params.type).updateOne({_id: ObjectId(req.body._id)}, {$set: newDocument}, (err, updateRes) => {
        if (err) throw err;

        newDocument._id = req.body._id;
        res.send(newDocument);

        console.log("[UPDATE] | " + req.params.type);
    });
});

// 데이터 삭제
router.delete('/:type', loginChecker.isLogin, (req, res) => {
    db.client.collection(req.params.type).deleteOne({_id: ObjectId(req.body._id)}, (err, deleteRes) => {
        if (err) throw err;

        res.send(req.body._id);

        console.log("[DELETE] | " + req.params.type);
    });
});

module.exports = router;