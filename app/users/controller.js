const User = require('./model')
const bcrypt = require('bcryptjs')

module.exports={
    viewSignin: async(req,res)=>{
        try{
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }

            res.render('admin/users/view_signin', {alert})
        }catch(err){
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/')
        }
    },
    actionSignin: async(req,res) => {
        try{
            const { email, password} = req.body
            const getUser = await User.findOne({ email: email })

            if(getUser){
                if(getUser.status === 'Y'){
                    const checkPassword = await bcrypt.compare(password, getUser.password)
                    if(checkPassword){
                        res.redirect('/dashboard')
                    }else{
                        req.flash('alertMessage', "kata sandi salah")
                        req.flash('alertStatus', 'danger')
                        res.redirect('/')
                    }
                }else{
                    req.flash('alertMessage', "status belum aktif")
                    req.flash('alertStatus', 'danger')
                    res.redirect('/')
                }
            }else{
                req.flash('alertMessage', "email tidak ditemukan")
                req.flash('alertStatus', 'danger')
                res.redirect('/')
            }
            
        }catch(err){
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/')
        }
    }
}