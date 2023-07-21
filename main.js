import express from "express"
import cors from "cors"
import morgan from "morgan"
import {config} from "dotenv"
import connect from "./database/conn.js"
import router from './router/router.js'
import cookieParser from'cookie-parser';
import session from 'express-session'
const corsOptions = {
  Credential: 'true',
  
};

const app =express()

app.use(morgan('tiny'))

app.use(express.json())
config()
app.use(cookieParser());
app.use(cors ({

        origin:["http://localhost:3000"],

    credentials: true
}) );
app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false
    })
  );
  app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });
  
app.use('/api',router)
app.get('/',(req,res)=>{
    try {
        res.json("Get Request")
    } catch (error) {
        res.json(error) 
    }})

const port=process.env.PORT||3004

connect().then(()=>{
    try{
app.listen(port,()=>
console.log(`server connected to http://localhost:${port}`)
)
    }catch(error){
        console.log("Cannot connect to the server")

    }
}).catch(err=>{
    console.log("Invalid Database Connection");
})

