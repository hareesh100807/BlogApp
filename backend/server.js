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

// CORS: allow multiple origins via FRONTEND_URLS or single FRONTEND_URL
const rawFrontends = process.env.FRONTEND_URLS || process.env.FRONTEND_URL || ''
const allowedOrigins = rawFrontends
  .split(',')
  .map((u) => u.trim().replace(/\/$/, ''))
  .filter(Boolean)

// Log resolved allowed origins for easier debugging in deployment logs
console.log('Resolved FRONTEND origins for CORS:', allowedOrigins.length ? allowedOrigins.join(', ') : '<<NONE - allowing all origins (unsafe for production)>>')

// Diagnostic endpoint to inspect CORS behavior after deploy
app.get('/cors-check', (req, res) => {
  const origin = req.headers.origin || null
  res.json({ origin, allowedOrigins })
})

// Custom CORS middleware: set headers for allowed origins and handle preflight
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // allow non-browser requests (curl/postman) without Origin header
  if (!origin) return next();

  // allow all if no whitelist set (useful for testing) or origin is whitelisted
  if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    if (req.method === 'OPTIONS') {
      // preflight
      return res.sendStatus(204);
    }

    return next();
  }

  // Origin not allowed
  return res.status(403).json({ message: 'CORS not allowed for origin: ' + origin });
})

//cookie parser
app.use(cookieParser())

app.use('/user-api',userApp);
app.use('/author-api',authorApp);
app.use('/admin-api',adminApp);
app.use('/auth',commonApp)

const connectDB = async () => {
  try {
    if (!process.env.DB_URL) {
      console.warn('DB_URL not set; skipping DB connection attempt.');
      return false;
    }

    await connect(process.env.DB_URL);
    console.log('DB server is connected');
    return true;
  } catch (err) {
    console.error('Unable to connect to DB:', err && err.message ? err.message : err);
    return false;
  }
};

const startServer = () => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server listening on ${port}...`));
};

(async () => {
  const dbConnected = await connectDB();
  console.log('DB connected:', dbConnected);
  startServer();
})();

// Process-level handlers for clearer logs
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  // Optional: exit process for critical errors
  // process.exit(1);
});

//to handle invalid path

app.use((req,res,next)=>{
    res.status(404).json({message:`path ${req.url} is invalid`})
})




//to handle errors
app.use((err,req,res,next)=>{
    // ensure CORS headers are present on error responses for allowed origins
    try{
      const origin = req.headers.origin
      if (origin) {
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          res.setHeader('Access-Control-Allow-Origin', origin)
          res.setHeader('Access-Control-Allow-Credentials', 'true')
          res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        }
      }
    }catch(e){
      console.log('error setting CORS headers on failure response',e)
    }

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