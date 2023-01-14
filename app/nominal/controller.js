const Nominal = require('./model')

module.exports={
    index: async(req,res)=>{
        try{
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }

            const nominal = await Nominal.find()

            res.render('admin/nominal/view_nominal', {nominal,alert})
        }catch(err){
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
}