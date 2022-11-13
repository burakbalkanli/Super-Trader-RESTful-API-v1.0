const Sequelize = require('sequelize');
const db = require('../config/db');

const Transaction = db.define(
    'transactions',
    {
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true    
        },
        userid:{
            type: Sequelize.INTEGER,
            allowNull:false
        },
        shareid:{
            type: Sequelize.INTEGER,
            allowNull:false
        },
        portfolioid:{
            type: Sequelize.INTEGER,
            allowNull:false
        },
        unit:{
            type: Sequelize.INTEGER,
            allowNull:false
        },
        rate:{
            type: Sequelize.INTEGER,
            allowNull:false
        },
        totaltrade:{
            type: Sequelize.INTEGER,
            allowNull:false
        },
        type:{
            type: Sequelize.STRING,
            allowNull:false
        }

    },
    {
        timestamps: true,
        freezeTableName: true
    }
);

Transaction.sync().then(() => {
    console.log('Transaction Table Created');
  });

module.exports = Transaction