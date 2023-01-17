const mongoose = require('mongoose');

let transactionSchema = mongoose.Schema({
    historyVoucherTopup:{
        gameName:{ type: String, require: [true, 'Nama game harus diisi'] },
        category:{ type: String, require: [true, 'Nama kategori harus diisi'] },
        thumbnail:{ type: String },
        coinName:{ type: String, require: [true, 'Nama koin harus diisi'] },
        coinQuantity:{ type: String, require: [true, 'Jumlah koin harus diisi'] },
        price:{ type: Number }
    },
    historyPayment:{
        name:{ type: String, require: [true, 'Nama harus diisi'] },
        type:{ type: String, require: [true, 'Tipe pembayaran harus diisi'] },
        bankName:{ type: String, require: [true, 'Nama bank harus diisi'] },
        noRekening:{ type: String, require: [true, 'Nomor rekening harus diisi'] }
    },
    name:{ 
        type: String, 
        require: [true, 'Nama harus diisi'], 
        maxlengt: [225, "Panjang antara 3 - 225 karakter"], 
        minlength: [3, "Panjang antara 3 - 225 karakter"]
    },
    accountUser:{ 
        type: String, 
        require: [true, 'Nama akun harus diisi'], 
        maxlengt: [225, "Panjang antara 3 - 225 karakter"], 
        minlength: [3, "Panjang antara 3 - 225 karakter"]
    },
    tax:{
        type: Number,
        default: 0
    },
    value:{
        type: Number,
        default: 0
    },
    status:{
        type:String,
        enum:['pending','success', 'failed'],
        default:'pending'
    },
    player:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    historyUser:{
        name:{ type: String, require: [true, 'Nama harus diisi'] },
        phoneNumber:{ 
            type: Number, 
            require: [true, 'Nama akun harus diisi'], 
            maxlengt: [225, "Panjang antara 3 - 225 karakter"], 
            minlength: [3, "Panjang antara 3 - 225 karakter"]
        },
    },
}, {timestamps:true})

module.exports = mongoose.model('Transaction', transactionSchema)