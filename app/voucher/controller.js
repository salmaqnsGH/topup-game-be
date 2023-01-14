const Voucher = require('./model')
const Category = require('../category/model')
const Nominal = require('../nominal/model')
const path = require('path')
const fs = require('fs')
const config = require('../../config')

module.exports={
    index: async(req,res)=>{
        try{
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }

            const voucher = await Voucher.find().populate('category').populate('nominals')
            console.log(voucher)

            res.render('admin/voucher/view_voucher', {voucher,alert})
        }catch(err){
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    viewCreate: async(req,res)=>{
        try{
            let categories = await Category.find()
            let nominals = await Nominal.find()
            res.render('admin/voucher/create',{ categories, nominals })
        }catch(err){
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    actionCreate: async(req, res)=>{
        try{
            const {name, category, nominals} = req.body
            if(req.file){
                let tmp_path = req.file.path;
                let originExt = req.file.originalname.split('.')[req.file.originalname.split('.').length -1]
                let filename = req.file.filename + '.' + originExt
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`)

                const src = fs.createReadStream(tmp_path)
                const dest = fs.createWriteStream(target_path)

                src.pipe(dest)

                src.on('end', async()=>{
                    try{
                        const voucher = new Voucher({name, category, nominals, thumbnail:filename })
                        await voucher.save();
                        
                        req.flash('alertMessage', 'Berhasil menambah voucher')
                        req.flash('alertStatus', 'success')
                        res.redirect('/voucher')
                    }catch(err){
                        req.flash('alertMessage', `${err.message}`)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/voucher')
                    }
                })
            }else{
                const voucher = new Voucher({name, category, nominals })
                await voucher.save();
                        
                req.flash('alertMessage', 'Berhasil menambah voucher')
                req.flash('alertStatus', 'success')
                res.redirect('/voucher')
            }

        }catch(err){
            req.flash('alertMessage', `${err.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
}