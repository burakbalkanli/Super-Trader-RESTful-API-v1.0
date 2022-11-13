const Sequelize = require('sequelize')
module.exports  = new Sequelize(
    process.env.PG_DB,
    process.env.PG_USER,
    process.env.PG_PASS,
    {
        host: process.env.PG_HOST,
        dialect: process.env.PG,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
)