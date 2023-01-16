const Payment = require('./model')
const Bank = require('../bank/model')

module.exports={
    index: async(req,res)=>{
        try{
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }

            const payment = await Payment.find().populate('banks')

            res.render('admin/payment/view_payment', {payment,alert})
        }catch(err){
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },
    viewCreate: async(req,res)=>{
        let banks = await Bank.find()
        try{
            res.render('admin/payment/create', {banks})
        }catch(err){
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },
    actionCreate: async(req,res)=>{
        try{
            const { type, banks } = req.body

            let payment = await Payment({ type, banks })

            await payment.save()

            req.flash('alertMessage', 'Berhasil menambahkan payment')
            req.flash('alertStatus', 'success')

            res.redirect('/payment')
        }catch(err){
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },
    viewEdit: async(req, res)=>{
        try{
            const {id} = req.params
            const banks = await Bank.find()
            let payment = await Payment.findOne({_id:id})
            .populate('banks')
            console.log(payment)
            
            res.render('admin/payment/edit',{
                payment, 
                banks,
            })
        }catch(err){
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },
    actionEdit: async(req, res)=>{
        try{
            const {id} = req.params
            const {type, banks} = req.body
            await Payment.findOneAndUpdate({_id:id},{type, banks})
            // console.log(payment)
            req.flash('alertMessage', 'Berhasil mengubah payment')
            req.flash('alertStatus', 'success')

            res.redirect('/payment')
        }catch(err){
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },
    actionDelete: async(req,res)=>{
        try{
            const {id} = req.params

            const payment = await Payment.findOneAndRemove({_id:id})

            req.flash('alertMessage', 'Berhasil menghapus payment')
            req.flash('alertStatus', 'success')

            res.redirect('/payment')
        }catch(err){
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },
}