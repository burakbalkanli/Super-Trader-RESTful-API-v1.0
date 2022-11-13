const Sequelize = require('sequelize');
const db = require('../config/db');

const User = db.define(
    'users',
    {
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true    
        },
        username:{
            type: Sequelize.STRING,
            unique: true
        },
        name:{
            type: Sequelize.STRING
        },
        surname:{
            type: Sequelize.STRING
        }
    },
    {
        timestamps: true,
        freezeTableName: true
    }
);

User.sync({ force: true }).then(() => {
    console.log('Users Table Created');
    User.bulkCreate([
        {
            name: 'Burak',
            surname: 'Balkanlı',
            username: 'burakbalkanli'
        },
        {
            name: 'Sarp',
            surname: 'Yakan',
            username: 'sarpyakan'
        },
        
    ],{
        ignoreDuplicates: true,
    })
    console.log('Users Table Initial Data Inserted');
  });

module.exports = User