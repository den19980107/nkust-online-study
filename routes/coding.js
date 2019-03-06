const express = require('express');
const router = express.Router();
//bring codeqution model
let CodeQution = require('../model/codeQution');
router.get('/', function (req, res) {
    CodeQution.find({}, function (err, qutions) {
        res.render('coding', {
            qutions: qutions
        })
    })
});

module.exports = router;