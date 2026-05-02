import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
const {verify} = jwt

config()

export const verifyToken=(...allowedRole)=>{
    return (req,res,next)=>{
         try{
    const token = req.cookies?.token
    //check token existance
    if(!token){
        return res.status(401).json({message:"Please Login"})
    }

    //validate token
    let decodedToken = verify(token,process.env.SECRET_KEY)
    //check the role is same as decoded token

    if(!allowedRole.includes(decodedToken.role)){
        return res.status(403).json({message:"You are not authorised"})
    }

    //add decoded token
    req.user = decodedToken;
    next()
}catch(err){
    res.status(401).json({message:"Invalid token"})
}
    }
}

// export const verifyToken = async(req,resizeBy,next)=>{
   

// }