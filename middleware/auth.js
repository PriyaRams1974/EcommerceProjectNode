const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user.model')
require('dotenv').config();

function authVerify (req,res,next){
    try {
        let token = req.header("token");
        console.log(token);
        if(!token){
            return res.json({status: "failure", message: "Unauthorised access"});
        }
        const decode = jwt.verify(token, process.env.secrectKey);
        console.log('DDECODE');
        console.log(decode)
        next();
    } catch (error) {
        console.log(error.message)
        return res.json({status: "failure", message: "Invalid token"})
    }    
}

function isAdmin (req,res,next){
    try{
        console.log("verify token");
        let token = req.header("token")
        if(!token){
            return res.json({status: "failure", "message": "Unauthorised access"})
        }
        const decode = jwt.verify(token, process.env.secrectKey);
        console.log(decode.uuid)
        const userdetails =  userSchema.findOne({uuid: decode.uuid}).exec();
        if(userdetails){
            console.log("yes he is admin")
            next();
       }else{
            return res.json({status: "failure", "message": "Unauthorised access"})
        }       
    }catch(error){
        console.log(error.message)
        return res.json({status: "failure", message: "Invalid token"})
    }
}

module.exports = {
 authVerify,isAdmin
}