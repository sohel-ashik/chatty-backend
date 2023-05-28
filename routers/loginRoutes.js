const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const upload = multer();
const bcrypt = require('bcrypt');
const model = require('../database_Schemas/userSchema');
const jwt = require('jsonwebtoken');

router.use(
    cors({
        origin: 'http://127.0.0.1:5173',
    })
)

router.post('/',upload.none(),async(req,res)=>{
    const {email,password} = req.body;
    try{
        const data = await model.findOne({email:email});
        if(data){
            const comparePass = await bcrypt.compare(password,data.password);
            if(comparePass){
                const token = jwt.sign({
                    user: data.name,
                    email: data.email
                },process.env.JWT_SECRET_KEY);
                res.send({msg:token,pass:true})
            } else{
                res.send({msg: 'authentication faulaur'});
            }
        }else{
            res.send({msg:"user not found"});
        }
    }catch(err){
        res.send({msg:"Something is wrong"});
    }

})

module.exports = router;