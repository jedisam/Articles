const express = require('express')

const router = express.Router()
// Article Model
let Article = require('../models/article')
let User = require('../models/user')


  // Access Control
  ensureAuthenticated = (req,res,next) =>{
    if(req.isAuthenticated()){
      next()
    } else {
      req.flash('danger','please login!')
      res.redirect('/users/login')
    }
  }


// add an article
router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('add_article',{title:'Add Article'})
  })

// get specific article with an id
router.get('/:id',(req,res)=>{
  // console.log(req.user)
    let id =req.params.id
    Article.findById(id,(err,result)=>{
      if(err){
        console.log(err)
      } else {
        User.findById(result.author,(err,user)=>{
          res.render('article',{
            result,
            author:user.name
          })
        })
      }
    })
  })

  // edit an article
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    let id = req.params.id
    Article.findById(id,(err,result)=>{
      if(req.user._id != result.author){
        req.flash('danger','Not Authorized!')
        res.redirect('/')
      }
      if(err){
        console.log(err)
      } else {
        res.render('edit_article',{result,title:'Edit Article'})
      }
    })
  })

   // Edit Post
 router.post('/edit/:id',(req,res)=>{
    let id = req.params.id
    let article={
      title : req.body.title,
      author: req.body.author,
      body:req.body.body
    }
    let query = {_id:id}
    Article.update(query,article,err=>{
      if(err){console.log(err)} else {
        req.flash('success','Article Updated!')
        res.redirect('/')
      }
    })
  })

  //delete article
 router.delete('/delete/:id',(req,res)=>{
   if(!req.user._id){
     res.status(500).send()
   }
    let id = req.params.id
    let query = {_id:id}
    Article.findById(id,(err,article)=>{
      if(req.user._id != article.author){
        res.status(500).send()
      } else{
          Article.deleteOne(query,err=>{
            if(err){console.log(err)} else res.send('success')
          })
      }
    })   
  })

  // post the article

  router.post('/add',(req,res)=>{
    //console.log('Me',req.user)
    req.checkBody('title','Title is required!').notEmpty()
    // req.checkBody('author','Author is required!').notEmpty()
    req.checkBody('body','Body is required!').notEmpty()

    let errors = req.validationErrors()
    if(errors){
      res.render('add_article',{
        title:'Add Article',
        errors
      })
    } else{
      User.findById(req.user._id,(err,user)=>{
        console.log('Name',user)
        let article = new Article({
          title:req.body.title,
          author:req.user._id,
          body:req.body.body,
          name:user.name
        })
        article.save(err=>{
          if(err){
            console.log(err)
          } else{
            req.flash('success','Article Added!')
            res.redirect('/')
          }
        })
      })
   }
  })



  module.exports= router