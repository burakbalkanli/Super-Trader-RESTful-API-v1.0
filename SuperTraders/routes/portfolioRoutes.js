const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const User =  require('../models/User');

router.get('',async (req,res) => {
    const portfolio = await Portfolio.findAll()

    if (!portfolio) {
        return res.status(400).send({
          message: `No portfolio found `,
        });
    }

    return res.send(portfolio)
})

router.get('/:userid',async (req,res) => {
    const { userid } = req.params
    const portfolio = await Portfolio.findAll({
        where:{
            userid,
        }
    })

    if (!portfolio) {
        return res.status(400).send({
          message: `No portfolio found `,
        });
    }

    return res.send(portfolio)
})


module.exports = router