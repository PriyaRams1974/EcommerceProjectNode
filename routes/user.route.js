const router = require('express').Router()
const bcrypt = require('bcrypt');
const userSchema = require('../models/user.model');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const {totp} = require('otplib');
const sms = require('fast-two-sms');
const MailSending = require('../middleware/email.js');
const ejs = require('ejs');
const {join} = require('path');




totp.options={ digits : 4 };


//new user register
router.post('/register',async(req,res)=>{
    try{
        bcrypt.hash(req.body.password,10,function(err,hasscode){
            if(err){
                res.json({'err':err.message})
            }
            let user = new userSchema({
                name : req.body.name,
                email : req.body.email,
                phone : req.body.phone,
                password : hasscode,
                address : req.body.address,
                role :req.body.role
            })
             user.save()
             .then(async user=>{
                let toMail = user.email
                let subject = "Account Activation mail"
                let mailData={
                    from:process.env.SENDGRIDEMAIL,
                    to:toMail,
                    subject:subject,
                    fileName : 'temp.ejs',
                    details :{
                        uuid:user.uuid
                    }
                }
                let data1 = MailSending.mailSending(mailData);

                res.json({status:'success',message:'user registration done successfully!','result':user})
             })
                
            })
    }catch(err){
        res.json({status:'failure',message:err.message})
    }
})


// const response = fast2sms.sendMessage({authorization : process.env.SMSAPIKEY , message : 'verify your mobile no OTP is '+token ,  numbers : ['9445376463']}) 
//         // let link = `http://192.168.1.26:7070/api/v2/users/VerifiedUserApi?uuid=${user.uuid}`
//         let link = `http://127.0.0.1:7070/api/v2/users/VerifiedUserApi?uuid=${user.uuid}`

//         const toMail = user.email;
//         const subject = "Account Activation Link";
//         const mailData = {
//             from: process.env.EMAIL,
//             to: toMail,
//             subject: subject,
//             // text: text
//             // html: `<h1>This is a Heading</h1><p>This is a Paragraph</p><p>Click here ${link}`
//             html: `<h1>This is a Heading</h1><p>This is a Paragraph</p><a href= ${link}>Click here</a><p>Thank you</p>`

//         }
//         let data = await MailSending.mailSending(mailData)
//         console.log("MAIL RESPONSE ",data)
//         // await mailService(emailDetail)
//         return res.status(200).json({status: "success", message: "user details added successfully", data: result})    
//     } catch (error) {
//         console.log(error.message)
//         return res.status(500).json({status: "failure", message: error.message})
//     }

router.get('/:uuid',async(req,res)=>{
    try{
    
        await userSchema.findOneAndUpdate({uuid:req.params.uuid},{active:true}).then(data=>{
            console.log('success');
            // res.end("hi, welcome to our page ");
            // res.end("you acount is activated")
            res.send(`<center><h1>WELLCOME<h1>
            <img src ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgX0TDHxP1NkHDATsBbYwCpd0p3O4bMmvxrw&usqp=CAU",width="250" height="250">
            <p>your account has been activated</p></center>`)
        })
    }catch(err){
    res.json({"error":err.message})
    }
    });


//user login
router.post('/login',async(req,res)=>{
try{
    var email = req.body.email
    var password = req.body.password 
  userSchema.findOne({email:email}).then(user=>{
      console.log(user);
      if(user){
        bcrypt.compare(password,user.password,function(err,result){
            if(err){
                res.json({'error':err.message});
            }
            if(result){
                const token = jwt.sign({uuid:user.uuid},process.env.secrectKey,{expiresIn:'1d'}) 

                return res.status(200).json({status:'success',message:'loggedin successfully','data':user,token})
                
            }else{
                return res.status(400).json({message:'password does not match!'});
            }
        })
    }else{
        return res.status(400).json({status:'failure',message:'username not found!'})
    }
    })

    const time = moment().toDate() 
    await userSchema.findOneAndUpdate({email:email},{latestVisted:time,loginStatus:true})
     }catch(err){
         res.json({'error':err.message})
        }
    });
// user logout
router.post('/logout',async(req,res)=>{
    try{
        const time = moment().toDate()
        const data = await userSchema.findOneAndUpdate({uuid:req.query.uuid},{latestVisted:time,loginStatus:false})
        return res.json({ststus:'success',message:'logout successfull!','loginstatus':data.loginStatus,'latestvisited':data.latestVisted})
    }catch(err){
        res.json({'error':err.message})
    }
});

// forget password
router.post('/forgetPassword',async(req,res)=>{
try{
 const name = req.body.name
    const sec = 'key'
    const digit = totp.generate(sec);
    console.log(digit)
    
    let msg ={
        authorization:'aaVv24VewoBzdfaPuCFkMEW8P4hWCZ8iMVq0V5BYSegy7E1bf0zgmgILHkEA',
        message : 'your reset password otp :'+digit,
        numbers : ["9092484971"]
        }
        sms.sendMessage(msg).then(result=>{
            console.log(result)
        }).catch(err=>{
            console.log(err)
        })
        userSchema.findOneAndUpdate({name:name},{otp:digit},{new:true}).exec();
        return res.json({status:'success',message:'yuour requested forgetPassword successfull! otp sended..',})
}catch(err){
    res.json({message:err.message})
}
})

//user reset password
router.post('/resetPassword',async(req,res)=>{
    try{

        bcrypt.hash(req.body.newPass,10,function(err,hasscode){
            if(err){
                console.log(err.message);
            }
            const otp = req.body.otp
            const newPass = hasscode
            console.log(newPass);
            const update = userSchema.findOneAndUpdate({otp:otp},{password:newPass},{new:true}).exec()
            if(update){
                res.json({message:'successfull'})
            }else{
                res.json({message:"faliure"});
            }
        })


        
    }catch(err){
        res.json({'error':err.message})
    }
})


module.exports= router
