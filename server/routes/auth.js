const express = require('express');
const User = require('../models/Users');
const router = express.Router();
var bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt=require('jsonwebtoken')

const JWT_SECRET="Harshisagoodboy"

router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }
        var salt =await bcrypt.genSaltSync(10);
        const secPass=await bcrypt.hash(req.body.password,salt)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });
        const data={
           user:{
            id:user.id,
           }
        }
        await user.save();
        const authToken=jwt.sign(data,JWT_SECRET)
        res.status(201).json({authToken:authToken}); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
//router for login
router.post("/login",[
    body('email').isEmail(),
],async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body
    try{
     let user=await User.findOne({email})
     if(!user){
        return res.status(400).json({err:"please enter a valid email,pass"})
     }
     const passwordCompare=await bcrypt.compare(password,user.password)
     if(!passwordCompare){
        return res.status(400).json({err:"please enter a valid email,pass"})
     }
     
     const data={
        user:{
            id:user.id
        }
     }
     const authToken=jwt.sign(data,JWT_SECRET)
        res.status(201).json({authToken:authToken}); 

    }catch(err){
        res.status(500).json("internal sever error")
    }
})

module.exports = router;
