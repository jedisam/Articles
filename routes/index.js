const express = require('express')

const router = express.Router()
let Article = require('../models/article')

router.get('/',(req,res)=>{
    Article.find({},(err,articles)=>{
      if(err){
        console.log(err)
      } else{
        res.render('index',{
          title:'TSite',
          articles
        })
      }
    })
  })

  module.exports = router