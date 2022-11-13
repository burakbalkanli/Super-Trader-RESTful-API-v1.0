const express = require('express')
const { Sequelize, Op } = require('sequelize')
const router = express.Router()
const Transaction = require('../models/Transaction')
const Share = require('../models/Share')
const User = require('../models/User')
const Portfolio = require('../models/Portfolio')


//Get all transactions
router.get('',async (req,res) => {
    const transaction = await Transaction.findAll()

    if (!portfolio) {
        return res.status(400).send({
          message: `No transaction found `,
        });
    }

    return res.send(transaction)
})

//Buy Operation
router.post('/buy', async (req,res) => {
    const {code,username,unit} = req.body

    //Validation for request body
    if (!code) {
        return res.status(400).send({
          message: 'Please provide a code to buy a share!',
        });
    }else if (!username) {
        return res.status(400).send({
          message: 'Please provide a username to buy a share!',
        });
    }else if (!unit) {
        return res.status(400).send({
          message: 'Please provide a per Unit to buy a share!',
        });
    }
    
    //Select share data with code and validate it
    const share = await Share.findOne({
        where: {
            code
        }
    })
    if (!share) {
        return res.status(400).send({
          message: `No share found with this code: ${code} in the system`,
        });
    }
    
    //Select user data with username and validate it
    const user = await User.findOne({
        where: {
            username
        }
    })
    if (!user) {
        return res.status(400).send({
          message: `No username found with this username: ${username} in the system`,
        });
    }

    
    //Check transactions for user in a hourly basis
    let transaction = await Transaction.findOne({
        where: {
            userid: user.id           
        },
        order: [['updatedAt','DESC']]
    })

    var currentdate = new Date(); 
    if((currentdate - transaction.updatedAt) >= 3600000){
        //Check user have portfolio
        const checkPortfolio = await Portfolio.findOne({
            where: {
                userid: user.id   
            }
        })
        if (!checkPortfolio) {
            return res.status(400).send({
            message: `No portfolio found with this username: ${username} in the system`,
            });
        }

        //Check user have this share in the portfolio
        const portfolio = await Portfolio.findOne({
            where: {
                userid: user.id,
                shareid: share.id           
            }
        })

        if (portfolio) {
            //If user have this share in portfolio, insert into transaction table and update the portfolio table
            try {
                //Insert Transaction
                const newTransaction = await Transaction.create({
                    userid: user.id,
                    shareid: share.id,
                    portfolioid: portfolio.id,
                    unit,
                    rate: share.latestprice,
                    totaltrade: unit * share.latestprice,
                    type: 'BUY'    
                })
                //Update Portfolio
                portfolio.unit += unit
                portfolio.totaltrade += unit * share.latestprice
                portfolio.save()
                return res.send(newTransaction)
            } catch (err) {
                return res.status(500).send({
                    message: `Error: ${err.message}`,
                });
            }
            
        }else{
            //If user dont have this share in the portfolio, insert into transaction table and portfolio table 
            try {
                //Insert Portfolio
                let newPortfolio = await Portfolio.create({
                    userid: user.id,
                    shareid: share.id,
                    unit,
                    totaltrade:unit * share.latestprice
                }).then(async(portfolio) =>{
                    //Insert Transaction
                    let newTransaction = await Transaction.create({
                            userid: user.id,
                            shareid: share.id,
                            portfolioid: portfolio.id,
                            unit,
                            rate: share.latestprice,
                            totaltrade: unit * share.latestprice,
                            type: 'BUY'    
                        }
                    )
                    return res.send(newTransaction)
                })
            } catch (err) {
                return res.status(500).send({
                    message: `Error: ${err.message}`,
                });
            }
        }
    }else{
        return res.status(400).send({
            message: `You can only trade once an hour. Your last trade date and time :${transaction.updatedAt}`,
        });
    }
})

//Sell Operation
router.post('/sell', async (req,res) => {
    const {code,username,unit} = req.body

    //Validation for request body
    if (!code) {
        return res.status(400).send({
          message: 'Please provide a code to sell a share!',
        });
    }else if (!username) {
        return res.status(400).send({
          message: 'Please provide a username to sell a share!',
        });
    }else if (!unit) {
        return res.status(400).send({
          message: 'Please provide a per Unit to sell a share!',
        });
    }

    //Select share data with code and validate it
    const share = await Share.findOne({
        where: {
            code
        }
    })
    if (!share) {
        return res.status(400).send({
          message: `No share found with this code: ${code} in the system`,
        });
    }

    //Select user data with username and validate it
    const user = await User.findOne({
        where: {
            username
        }
    })
    if (!user) {
        return res.status(400).send({
          message: `No username found with this username: ${username} in the system`,
        });
    }

    //Check transactions for user in a hourly basis
    let transaction = await Transaction.findOne({
        where: {
            userid: user.id           
        },
        order: [['updatedAt','DESC']]
    })

    var currentdate = new Date(); 
    if((currentdate - transaction.updatedAt) >= 3600000){
        //Check user have portfolio
        const checkPortfolio = await Portfolio.findOne({
            where: {
                userid: user.id   
            }
        })
        if (!checkPortfolio) {
            return res.status(400).send({
            message: `No portfolio found with this username: ${username} in the system`,
            });
        }

        //Check user have this share in the portfolio
        const checkPortfolioHaveShare = await Portfolio.findOne({
            where: {
                userid: user.id,
                shareid: share.id           
            }
        })
        if (!checkPortfolioHaveShare) {
            return res.status(400).send({
            message: `No portfolio found with this share: ${share.name} in the portfolio`,
            });
        }

        //Check user have this share in the portfolio
        const portfolio = await Portfolio.findOne({
            where: {
                userid: user.id,
                shareid: share.id,
                unit:{
                    [Op.gte]:unit
                }           
            }
        })
        if(!portfolio){
            return res.status(400).send({
                message: `The number of shares not sufficient in the portfolio`
            })
        }

        //Insert into transaction table and update or delete the portfolio table 
        try {
            //Insert Transaction
            let newTransaction = await Transaction.create({
                userid: user.id,
                shareid: share.id,
                portfolioid: portfolio.id,
                unit,
                rate: share.latestprice,
                totaltrade: unit * share.latestprice,
                type: 'SELL'    
            })

            if(portfolio.unit == unit){
                //If user want to sell all of the share, share record delete in the portfolio table
                try {
                    await portfolio.destroy();
                    return res.send(newTransaction)
                } catch (err) {
                    return res.status(500).send({
                    message: `Error: ${err.message}`,
                    });
                }
            }else{
                //If user don't want sell all of the share, share record updated in the portfolio table
                portfolio.unit -= unit
                portfolio.totaltrade -= unit * share.latestprice
                portfolio.save()
                return res.send(newTransaction)
            }

        } catch (err) {
            return res.status(500).send({
                message: `Error: ${err.message}`,
            });
        }
    }else{
        return res.status(400).send({
            message: `You can only trade once an hour. Your last trade date and time :${transaction.updatedAt}`,
        });
    }

})



module.exports = router