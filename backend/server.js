import exp from 'express'
import {config} from 'dotenv'
import {connect} from 'mongoose'
import {userApp} from './APIs/userAPI.js'
import {authorApp} from './APIs/authorAPI.js'
import {adminApp} from './APIs/adminAPI.js'
import {commonApp} from './APIs/commonAPI.js'
import cookieParser from 'cookie-parser'
import cors from 'cors' 

const app = exp()
config()
    

//body passer middleware
app.use(exp.json())
app.use(cors({
    origin: process.env.FRONTEND_URL?.replace(/\/$/, ''),
    credentials: true
}))

//cookie parser
app.use(cookieParser())

app.use('/user-api',userApp);
app.use('/author-api',authorApp);
app.use('/admin-api',adminApp);
app.use('/auth',commonApp)

const connectDB = async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("DB server is connected")
        const port = process.env.PORT || 5000
        app.listen(port,()=>console.log(`Server listining on ${port}...`))
    }catch(err){
        console.log("unable to connect",err)
    }
}
connectDB()


//to handle invalid path

app.use((req,res,next)=>{
    res.status(404).json({message:`path ${req.url} is invalid`})
})




//to handle errors
app.use((err,req,res,next)=>{
    // res.status().json({message:"Error Occured",error:err.message})
    // console.log(err.name)
    // console.log(err.code)
    console.log("error is :",err)
    if(err.name === 'ValidationError'){
        return res.status(400).json({message:"Error Occured",error:err.message})
    }
    if(err.name == 'CastError'){
         return res.status(400).json({message:"Error Occured",error:err.message})
    }

    //server side

    res.status(500).json({message:"Error Occured",error:err.message})
  
    }
)