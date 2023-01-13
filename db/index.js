const mongoose = require('mongoose')
const {urlDb} = require('../config')

mongoose.set('strictQuery', true);

mongoose.connect(urlDb, {
    useUnifiedTopology:true,
    // useFindAndModify:true,
    // useCreateIndex:true
})

const db = mongoose.connection
module.exports = db;