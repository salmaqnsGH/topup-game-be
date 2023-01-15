const mongoose = require('mongoose')

let bankSchema = mongoose.Schema({
    name:{
        type:String,
        require:[true,'Nama pemilik harus diisi']
    },
    bankName:{
        type:String,
        require:[true,'Nama bank harus diisi']
    },
    noRekening:{
        type:String,
        require:[true,'Nama rekening harus diisi']
    }
})

module.exports = mongoose.model('Bank', bankSchema)