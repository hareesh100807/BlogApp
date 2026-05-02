import exp from 'express'
import {UserModel} from '../models/userModel.js'
import { hash,compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
const {sign} = jwt
import {config} from 'dotenv'
import { verifyToken } from '../middlewares/verifyToken.js'
import cloudinary from '../config/cloudinary.js'
config()
export const commonApp = exp.Router()
import {upload} from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'

//Route for registration
commonApp.post("/users",upload.single("profileImageUrl"),async(req,res)=>{
    let allowedRoles = ["USER","AUTHOR"]

    const newUser = req.body
    //check role

    if(!allowedRoles.includes(newUser.role)){
        return res.status(400).json({message:"Invalid role"})
    }

    let cloudinaryResult;

    try {
        //upload image to cloudinary from memory storage
        if(req.file){
           cloudinaryResult = await uploadToCloudinary(req.file.buffer)
        }

        //add cloudinary result to newUser object
        newUser.profileImageUrl = cloudinaryResult?.secure_url || ""

        //run validators manually
        newUser.password = await hash(newUser.password,12)
        const newUserDoc = new UserModel(newUser)

        await newUserDoc.save()
        res.status(201).json({message:"User is created"})
    } catch(err){
        if(cloudinaryResult?.public_id){
            await cloudinary.uploader.destroy(cloudinaryResult.public_id)
        }
        res.status(500).json({message:"Error in user creation",error:err.message})
    }
})


//route for login
commonApp.post('/login',async(req,res)=>{
   
    //get user credentials object
    const {email,password} = req.body
    //find user by email
    const user = await UserModel.findOne({email:email})
    if(!user){
        return res.status(400).json({message:"Invalid Email"})
    }

    //compare password
    const isMatched = await compare(password,user.password)
    if(!isMatched){
        return res.status(400).json({message:"Invalid Password"})
    }
    const signedToken = sign(
        {userId:user._id.toString(),email:email,role:user.role},
        process.env.SECRET_KEY,
        {expiresIn:"1d"}
    )
    res.cookie("token",signedToken,{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })
    //remocve password from user document
    let userObj = user.toObject();
    delete userObj.password

    res.status(200).json({message:"Login successfull",payload:userObj})
    
})

//logout
commonApp.get("/logout",(req,res)=>{
    res.clearCookie("token",{
        httpOnly:true,
        secure:false,
        sameSite:"lax"
    })
    res.status(200).json({message:"Logout Success"})
})

//page refresh: validate cookie token and return current user payload
commonApp.get("/check-auth",verifyToken("USER","AUTHOR","ADMIN"),async(req,res)=>{
    try {
        const user = await UserModel.findById(req.user?.userId).select("-password").lean()

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        res.status(200).json({
            message:"authenticated",
            payload:user
        })
    } catch (err) {
        res.status(500).json({message:"Error in auth check",error:err.message})
    }
})


commonApp.put("/password",verifyToken("USER","AUTHOR","ADMIN"),async(req,res)=>{
    //check current password and new password are same
    const {oldPass,newPass} = req.body
    const user = await UserModel.findById(req.user?.userId) 
    if(oldPass === newPass){ return res.status(400).json({message:"Both passwords are same"})}
    //get current password of user/admin/author
    //check the current password password of request and user are not same
   const isMatch = await compare(oldPass,user.password)
    if(!isMatch){ return res.status(400).json({message:"Old password does not match"})}
    //hash new password replace current password of user with hashed new password
     user.password = await hash(newPass,12)
     await user.save()
     res.status(200).json({message:"Password updated successfully"})

})
