const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const validator = require('../utilities/validator');
const userSchemaModel = require('../database_Schemas/userSchema');
const deleteFile = require('../utilities/fileDelete');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

router.use(
    cors({
        origin: 'http://127.0.0.1:5173',
    })
)

//disk storage clearrence
const imgStorage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,'./user_profile_pic')
    },
    filename: (req,file,callback)=>{
        callback(null,file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})

//upload model
const upload_body = multer();
const upload = multer({
    storage: imgStorage,
    limits: 1000 * 1000 * 2, // bytes * kb * mb
    fileFilter : (req,file,callback) =>{
        if(!file.originalname.match(/\.(png|jpeg|jpg|JPG|JPEG)$/)){
            return callback(new Error("Please upload an image"));
        } else {
            callback(null,true);
        }
    }
})


// all routes

router.get('/',async(req,res)=>{
    try{
        const data = await userSchemaModel.find({},'name email mobile avatar');
        res.send(data);
    } catch(err){
        res.send({msg:err});
    }
})


router.post('/',upload.single('file'), async (req,res)=>{
    const recentPicPath = req.file.filename;

    const data = req.body;
    //validations
    const validate = validator(data.name,data.email,data.mobile,data.password);

    if(validate){
        const userData = {...data};
        userData.password = await bcrypt.hash(userData.password,10);
        userData.avatar = path.resolve(__dirname, '..', 'user_profile_pic', recentPicPath);

        try{
            const verify_token = jwt.verify(userData.token,process.env.JWT_SECRET_KEY);
            if(verify_token){
                const result = await userSchemaModel.findOne({
                    $or: [
                        { email: userData.email},
                        { mobile: userData.mobile}
                    ]
                }).exec();
    
                if(result){
                    await deleteFile(recentPicPath);
                    res.send({msg: "User found please login"});
                }else {    
                    const savedData = new userSchemaModel(userData);
                    await savedData.save(); //data is storing in db
                    res.send({msg:"New user added"})
                }
            }

        }catch(err){
            console.log(err);
            await deleteFile(recentPicPath);
            res.send({msg:"Invalid"})
        }
    } else {
        await deleteFile(recentPicPath);
        res.send({msg:"Invalid"})
    }
})

router.delete('/',upload_body.none(),async(req,res)=>{
    const condition = req.body;

    try{
        const verify_token = jwt.verify(condition.token,process.env.JWT_SECRET_KEY);
        if(verify_token){
            const delete_result = await userSchemaModel.findOneAndDelete({email:condition.email});
            if(delete_result){
                const filePath = delete_result.avatar;
                try{
                    await deleteFile(filePath,true);
                    res.send({msg:`${condition.email} has been removed`})
                }catch(err){
                    res.send({msg:'user removed but profile pic is not'})
                }
            } else{
                res.send({msg:`${condition.email} is not found`});
            }
        }
        
    }catch(err){
        console.log(err);
        res.send({msg:"Something is wrong"})
    }
})

router.use(express.static('public'));

router.get('/image',async(req,res)=>{
    const image = req.query.image;
    res.sendFile(image)
})

module.exports = router;