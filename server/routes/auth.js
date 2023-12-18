const express=require('express')
const User =require('../models/Users')
const router=express.Router()

router.post("/",(req,res)=>{
    const user=User(req.body)
    user.save()
    res.send("auth")
})

module.exports=router