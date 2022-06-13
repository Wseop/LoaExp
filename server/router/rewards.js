const express = require('express');
const router = express.Router();
require('dotenv').config();
const documentSetter = require('../utils/documentSetter.js');
const loginChecker = require('../loginChecker.js');
const db = require('../db.js');
const ObjectId = require('mongodb').ObjectId;

// 전체 조회
router.get('/:content', loginChecker.isLogin, (req, res) => {
    db.client.collection(req.params.content).find({userId: req.user.id}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[REWARDS][READ] | " + req.params.content);
    });
});

// 캐릭터명으로 조회
router.get('/:content/character', loginChecker.isLogin, (req, res) => {
    db.client.collection(req.params.content).find({userId: req.user.id, character: req.body.character}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[REWARDS][READ][CHARACTER] | " + req.params.content);
    });
});

// 날짜로 조회
router.get('/:content/date', loginChecker.isLogin, (req, res) => {
    db.client.collection(req.params.content).find({userId: req.user.id, year: req.body.year, month: req.body.month}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[REWARDS][READ][DATE] | " + req.params.content);
    });
});

// 데이터 추가
router.post('/:content', loginChecker.isLogin, async (req, res) => {
    let newDocument = await documentSetter.setReward(req.user.id, req.body);

    db.client.collection(req.params.content).insertOne(newDocument, (err, insertRes) => {
        if (err) throw err;

        newDocument._id = insertRes.insertedId;
        res.send(newDocument);

        console.log("[REWARDS][CREATE] | " + req.params.content);
    });
});

// 데이터 수정
router.put('/:content', loginChecker.isLogin, async (req, res) => {
    let newDocument = await documentSetter.setReward(req.user.id, req.body);

    db.client.collection(req.params.content).updateOne({_id: ObjectId(req.body._id)}, {$set: newDocument}, (err, updateRes) => {
        if (err) throw err;

        newDocument._id = req.body._id;
        res.send(newDocument);

        console.log("[REWARDS][UPDATE] | " + req.params.content);
    });
});

// 데이터 삭제
router.delete('/:content', loginChecker.isLogin, (req, res) => {
    db.client.collection(req.params.content).deleteOne({_id: ObjectId(req.body._id)}, (err, deleteRes) => {
        if (err) throw err;

        res.send(req.body._id);

        console.log("[REWARDS][DELETE] | " + req.params.content);
    });
});

module.exports = router;