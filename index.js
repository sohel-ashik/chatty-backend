const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const model = require('./database_Schemas/userSchema');
const signupRouter = require('./routers/signupRoutes');
const loginRouter = require('./routers/loginRoutes');

dotenv.config();

const app = express();

//database connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(()=>console.log('database connected'))
    .catch(err => console.log(err));



//request perser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/',async(req,res)=>{
    res.send("Home");
})

// signup admin or user
app.use('/signup',signupRouter);
app.use('/login',loginRouter);


app.listen(process.env.PORT,()=>{
    console.log(`app is listening in port ${process.env.PORT}`);
})


console.clear();
console.log("===================================================")