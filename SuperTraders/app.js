require('dotenv/config')
const express = require('express')
const path = require('path')
const user = require('./routes/userRoutes')
const share = require('./routes/shareRoutes')
const transaction = require('./routes/transactionRoutes')
const portfolio = require('./routes/portfolioRoutes')

//DB config
const db = require('./config/db.js')


// Test DB connection
db.authenticate()
    .then(()=> console.log('Database Connected...'))
    .catch(err => console.log(`Error has occured ${err}`))

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Index route
app.get('/', (req, res) => res.sendFile(__dirname + "/infopage/index.html"));

//User Route
app.use('/user',user)

//Share Route
app.use('/share',share)

//Transaction Route
app.use('/transaction',transaction)

//Portfolio Route
app.use('/portfolio',portfolio)


const PORT = process.env.PORT

app.listen(PORT,console.log(`Server started on port ${PORT}`))
console.log(__dirname + "/index.html")
