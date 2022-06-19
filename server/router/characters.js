const express = require('express');
const router = express.Router();
require('dotenv').config();
const loginChecker = require('../loginChecker.js');
const db = require('../db.js');

// 보유 캐릭터 목록을 조회
router.get('/', loginChecker.isLogin, (req, res) => {

    db.client.collection(process.env.COLLECTION_CHARACTER).findOne({userId: req.user.id}, (err, findRes) => {
        if (err) throw err;

        let characterList = findRes.list;
        res.send(characterList);

        console.log("[CHARACTER][READ]");
    });
});

// 캐릭터 추가
router.put('/add', loginChecker.isLogin, (req, res) => {
    // 기존 데이터 조회
    db.client.collection(process.env.COLLECTION_CHARACTER).findOne({userId: req.user.id}, (err, findRes) => {
        if (err) throw err;

        // 새 캐릭터 추가
        let newCharacterList = findRes.list;
        let newCharacter = {name: req.body.name, level: req.body.level, class:req.body.class};
        newCharacterList.push(newCharacter);

        // db update
        let newDocument = {userId: req.user.id, list: newCharacterList};
        db.client.collection(process.env.COLLECTION_CHARACTER).updateOne({userId: req.user.id}, {$set: newDocument}, (err, updateRes) => {
            if (err) throw err;

            res.send(newCharacterList);
            
            console.log("[CHARACTER][CREATE]");
        });
    });
});

// 캐릭터 정보 수정
router.put('/edit', loginChecker.isLogin, (req, res) => {
    // 기존 데이터 조회
    db.client.collection(process.env.COLLECTION_CHARACTER).findOne({userId: req.user.id}, (err, findRes) => {
        if (err) throw err;

        let characterList = findRes.list;
        let newCharacter = {name: req.body.newName, level: req.body.newLevel, class: req.body.newClass};
        // 데이터 수정
        characterList[req.body.index] = newCharacter;
        // db update
        let newDocument = {userId: req.user.id, list: characterList};
        db.client.collection(process.env.COLLECTION_CHARACTER).updateOne({userId: req.user.id}, {$set: newDocument}, (err, updateRes) => {
            if (err) throw err;

            res.send(characterList);

            console.log("[CHARACTER][UPDATE]");
        });
    });
});

// 캐릭터 삭제
router.delete('/', loginChecker.isLogin, (req, res) => {
    db.client.collection(process.env.COLLECTION_CHARACTER).findOne({userId: req.user.id}, (err, findRes) => {
        if (err) throw err;

        let characterList = findRes.list;
        // 배열에서 캐릭터 삭제
        characterList.splice(req.body.index, 1);
        // db update
        let newDocument = {userId: req.user.id, list: characterList};
        db.client.collection(process.env.COLLECTION_CHARACTER).updateOne({userId: req.user.id}, {$set: newDocument}, (err, updateRes) => {
            if (err) throw err;

            res.send(characterList);

            console.log("[CHARACTER][DELETE]");
        });
    });
});

module.exports = router;