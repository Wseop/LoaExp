const express = require('express');
const router = express.Router();
require('dotenv').config();
const documentSetter = require('../utils/documentSetter.js');
const loginChecker = require('../loginChecker.js');
const db = require('../db.js');
const ObjectId = require('mongodb').ObjectId;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const { send } = require('process');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/temp')
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        if (ext !== '.html') {
            callback(null, false);
        } else {
            callback(null, true);
        }
    }
});
const uploadSingleHtml = upload.single('html');

// 전체 조회
router.get('/', loginChecker.isLogin, (req, res) => {
    db.client.collection(process.env.COLLECTION_ACCESSORIES).find({userId: req.user.id}).toArray((err, findRes) => {
        if (err) throw err;

        res.send(findRes);

        console.log("[ACC][READ]");
    });
});

// 날짜로 조회
// router.get('/date', loginChecker.isLogin, (req, res) => {
//     db.client.collection(process.env.COLLECTION_ACCESSORIES).find({userId: req.user.id, year: req.body.year, month: req.body.month}).toArray((err, findRes) => {
//         if (err) throw err;

//         res.send(findRes);

//         console.log("[ACC][READ][DATE]");
//     });
// });

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

// 데이터 추가 - html file
router.post('/html', loginChecker.isLogin, async (req, res) => {
    uploadSingleHtml(req, res, async (err) => {
        if (req.file == null) {
            res.status(400).send(false);
        } else {
            // 전송받은 파일 로드
            let $ = cheerio.load(fs.readFileSync('./public/temp/' + req.file.filename));
            // 우선 response 후 처리
            res.status(200).send(true);
            // 모든 열을 순회하며 데이터 추가 진행
            await Promise.all($('body > div > table > tbody').children().map(async (i, element) => {
                if (i !== 0) {
                    let body = {};
                    
                    body.grade = $(element).children('td')[0].children[0].data
                    body.part = $(element).children('td')[1].children[0].data
                    body.quality = $(element).children('td')[2].children[0].data
                    body.ability1 = $(element).children('td')[3].children[0].data
                    body.ability2 = $(element).children('td')[4].children[0] == null ? null : $(element).children('td')[4].children[0].data;
                    body.engrave1 = $(element).children('td')[5].children[0].data
                    body.engrave2 = $(element).children('td')[6].children[0].data
                    body.from = $(element).children('td')[7].children[0].data

                    let newDocument = await documentSetter.setAccessory(req.user.id, body);
                    await db.client.collection(process.env.COLLECTION_ACCESSORIES).insertOne(newDocument);
                }
            }));
           
            // 완료되면 파일 삭제
            fs.unlinkSync('./public/temp/' + req.file.filename);

            console.log("[ACC][CREATE][by html]");
        }
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