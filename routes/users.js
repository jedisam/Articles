const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const router = express.Router()

const User = require('../models/user')

router.get('/register',(req,res)=>{
    res.render('register')
})

router.get('/login',(req,res)=>{
    res.render('login')
})

router.post('/register',(req,res)=>{
    let name=req.body.name
    let email=req.body.email
    let username=req.body.username
    let password=req.body.password

    req.checkBody('name','Name is required!').notEmpty()
    req.checkBody('email','Email is required!').notEmpty()
    req.checkBody('email','Please fill an a correct email address!').isEmail()
    req.checkBody('username','Username is required!').notEmpty()
    req.checkBody('password','password is required!').notEmpty()
    req.checkBody('confirm','Passwords dont match!').equals(password)

    let errors = req.validationErrors()
    if(errors){
        res.render('register',{errors})
    } else{
        let newUser = User({
            name:name,
            email:email,
            username:username,
            password:password
        })
        bcrypt.genSalt(15,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err){
                    console.log(err)
                } else {
                    newUser.password= hash
                    newUser.save(err=>{
                        if(err){
                            console.log(err)
                            return
                        } else{
                            req.flash('success','You are now registered and can now login!')
                            res.redirect('/users/login')
                        }
                    })
                }
            })
        })
    }
})

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',
    {
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
    
})
router.get('/logout',(req,res)=>{
    req.logout()
    req.flash('success','you are logged out')
    res.redirect('/users/login')
})


module.exports = router