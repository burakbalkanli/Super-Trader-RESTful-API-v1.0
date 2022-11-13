const Sequelize = require('sequelize');
const db = require('../config/db');

const Share = db.define(
    'shares',
    {
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true    
        },
        code:{
            type: Sequelize.STRING(3),
            unique: true
        },
        name:{
            type: Sequelize.STRING
        },
        latestprice:{
            type: Sequelize.INTEGER
        }
    },
    {
        timestamps: true,
        freezeTableName: true
    }
);

Share.sync({ force: true }).then(() => {
    console.log('Shares Table Created');
    Share.bulkCreate([
        {
            code: 'ERG',
            name: 'Eregli Demir Çelik',
            latestprice: 100
        },
        {
            code: 'SIS',
            name: 'Sisecam',
            latestprice: 112
        },
        {
            code: 'SAH',
            name: 'Sabancı Holding',
            latestprice: 125
        },
        {
            code: 'TUP',
            name: 'Tupras',
            latestprice: 100
        },
        {
            code: 'VAB',
            name: 'Vakıfbank',
            latestprice: 50
        },
        {
            code: 'GAB',
            name: 'Garanti Bankası',
            latestprice: 90
        }
    ],{
        ignoreDuplicates: true,
    })
    console.log('Shares Table Initial Data Inserted');
  });

module.exports = Share