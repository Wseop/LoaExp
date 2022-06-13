const express = require('express');
const router = express.Router();
require('dotenv').config();
const documentSetter = require('../utils/documentSetter.js');
const loginChecker = require('../loginChecker.js');
const db = require('../db.js');
const ObjectId = require('mongodb').ObjectId;

// 전체 조회
router.get('/', loginChecker.isLogin, (req, res) => {
    db.client.collection(process.env.COLLECTION_ACCESSORIES).find({userId: req.user.id}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[ACC][READ]");
    });
});

// 캐릭터명으로 조회
router.get('/chatacter', loginChecker.isLogin, (req, res) => {
    db.client.collection(process.env.COLLECTION_ACCESSORIES).find({userId: req.user.id, character: req.body.character}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[ACC][READ][CHARACTER]");
    });
});

// 날짜로 조회
router.get('/date', loginChecker.isLogin, (req, res) => {
    db.client.collection(process.env.COLLECTION_ACCESSORIES).find({userId: req.user.id, year: req.body.year, month: req.body.month}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[ACC][READ][DATE]");
    });
});

// 데이터 추가
router.post('/', loginChecker.isLogin, async (req, res) => {
    let newDocument = await documentSetter.setAccessory(req.user.id, req.body);

    db.client.collection(process.env.COLLECTION_ACCESSORIES).insertOne(newDocument, (err, insertRes) => {
        if (err) throw err;

        newDocument._id = insertRes.insertedId;
        res.send(newDocument);

        console.log("[ACC][CREATE]");
    });
});

// 데이터 수정
router.put('/', loginChecker.isLogin, async (req, res) => {
    let newDocument = await documentSetter.setAccessory(req.user.id, req.body);

    db.client.collection(process.env.COLLECTION_ACCESSORIES).updateOne({_id: ObjectId(req.body._id)}, {$set: newDocument}, (err, updateRes) => {
        if (err) throw err;

        newDocument._id = req.body._id;
        res.send(newDocument);

        console.log("[ACC][UPDATE]");
    })
});

// 데이터 삭제
router.delete('/', loginChecker.isLogin, (req, res) => {
    db.client.collection(process.env.COLLECTION_ACCESSORIES).deleteOne({_id: ObjectId(req.body._id)}, (err, deleteRes) => {
        if (err) throw err;

        res.send(req.body._id);

        console.log("[ACC][DELETE]");
    })
});

module.exports = router;