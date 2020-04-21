const express = require('express')

const router = express.Router()
// Article Model
let Article = require('../models/article')
// Users Model
let User = require('../models/user')

router.get('/',(req,res)=>{
    Article.find({},(err,articles)=>{
      console.log(articles)
      if(err){
        console.log(err)
      } else{
        res.render('article_posts',{
          title:'TSite',
          articles
        })
      }
    })
  })

  module.exports= router