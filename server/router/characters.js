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
        for (let i = 0; i < characterList.length; i++) {
            if (characterList[i].name === req.body.name) {
                characterList[i] = newCharacter;
                break;
            }
        }
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
        let newCharacterList = [];
        // 삭제할 캐릭터를 제외하고 새로운 배열로 복사
        characterList.map((character, i) => {
            if (character.name !== req.body.name) {
                newCharacterList.push(character);
            }
        });
        // db update
        let newDocument = {userId: req.user.id, list: newCharacterList};
        db.client.collection(process.env.COLLECTION_CHARACTER).updateOne({userId: req.user.id}, {$set: newDocument}, (err, updateRes) => {
            if (err) throw err;

            res.send(newCharacterList);

            console.log("[CHARACTER][DELETE]");
        });
    });
});

module.exports = router;