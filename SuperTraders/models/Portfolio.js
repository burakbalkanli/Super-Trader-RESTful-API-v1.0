const Sequelize = require('sequelize');
const db = require('../config/db');

const Portfolio = db.define(
    'portfolio',
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
        unit:{
            type: Sequelize.INTEGER,
            allowNull:false
        },
        totaltrade:{
            type: Sequelize.INTEGER,
            allowNull:false
        }
    },
    {
        timestamps: true,
        freezeTableName: true
    }
);

Portfolio.sync({ force: true }).then(() => {
    console.log('Portfolio Table Created');
    Portfolio.bulkCreate([
        {
            userid: 1,
            shareid: 1,
            unit: 50,
            totaltrade:5000
        },
        {
            userid: 1,
            shareid: 5,
            unit: 20,
            totaltrade:1000
        },
        
    ],{
        ignoreDuplicates: true,
    })
    console.log('Portfolio Table Initial Data Inserted');
  });

module.exports = Portfolio