const jwt=require('jsonwebtoken')
const JWT_SECRET="Harshisagoodboy"

const fetchUser=(req,res,next)=>{
    //Get user from JWT Token
    const token=req.header('auth-token')
    if(!token){
        res.status(401).json({error:"please authenticate using a valid token"})
    }
    try{
        const data=jwt.verify(token,JWT_SECRET)
        req.user=data.user
        next()
    }catch(err){
        res.status(401).json({error:"please authenticate using a valid token"})
    }
    
}

module.exports=fetchUser;