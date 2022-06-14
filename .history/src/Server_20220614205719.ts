import express from "express";
import http from "http";
import helmet from "helmet";
import mongoose from "mongoose";
// custom imports
import AuthRouter from "./routes/Auth";
import DataRouter from "./routes/data";

// constants
const app = express();
const Server = http.createServer(app);
const PORT = process.env.PORT || 5000;


// middlewares
app.use(helmet());
// app.use(helmet.hidePoweredBy());
app.use(express.json({ limit : '1kb'}));
app.use(express.urlencoded({ extended : true , limit : '1kb'}));

// routes

app.post('/' , (req , res) => res.send("hi"));

app.use('/auth' , AuthRouter);
app.use('/notes' ,DataRouter);


// default 404 page
app.use((req , res ) =>{
    res.json({
        status:404,
        message:`Seems like you are lost.Try another route`,
    })
})

// your mongo db string goes here
const mongoDbString = "yourmongodbgoesHere";


mongoose.connect(mongoDbString)
.then(()=>{
    Server.listen(PORT , ()=>{ console.log(`Server running on port ${PORT}`)});
})
.catch(error => {throw new Error(`Unable to connect to mongo db \n ${error}`)});


// Server listen

// basic token --expires 30days after user creation
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzY0N2FmZTlmMDYzYWY3YzgxMzNiNSIsIm9wZXJhdGlvbiI6ImF1dGgiLCJpYXQiOjE2NTE5MTg3NjgsImV4cCI6MTY1NDUxMDc2OH0.4Irq-I1G3tryVyVEzO8C4B2nir5nxcpyHRFHgJlCGbs
// basic details
// email :user@gmail.com
// username : usertest
// password: user123456