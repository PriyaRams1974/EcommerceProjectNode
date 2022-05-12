const nodemailer = require('nodemailer');
require('dotenv').config();
const ejs = require('ejs');
const {join} = require('path');
const sgMail=require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRIDAPIKEY);

const transporter = nodemailer.createTransport({
   service:'gmail',
    auth:{
        user : process.env.EMAIL,
        pass :process.env.PASSWORD 
    },
});

// const transporter = nodemailer.createTransport({
//     port: 465,
//     host: "smtp.gmail.com",
//     auth:{
//         user : process.env.EMAIL,
//         pass :process.env.PASSWORD 
//     },
// });
async function mailSending(mailData){
    console.log("mailSending",mailData)

    try{
        let data = await ejs.renderFile(join(__dirname,'../templates/',mailData.fileName),mailData,mailData.details)

        const mailDetails = {
            from : mailData.from,
            to : mailData.to,
            subject : mailData.subject,
            //text : maildata.text,
            //attachments : mailData.attachments,
            html : data
        }
    transporter.sendMail(mailDetails,(err,data)=>{
        if(err)
        console.log('mail not sent'+err.message);
        else
        console.log('Mail sent');
    })
}catch(err){
    console.log(err.message);
    process.exit(1);
   }
}

async function mailsending(maildata){
    try{
        console.log('success')

        let data = await ejs.renderFile(join(__dirname,'../templates/',maildata.fileName),maildata,maildata.details)

        const mailDetails = {
            from : maildata.from,
            to : maildata.to,
            subject : maildata.subject,
            //text : maildata.text,
            //attachments : mailData.attachments,
            html : data
        }

        sgMail.send(mailDetails,(err,data)=>{
            if(data){
                console.log("mail sent",data);
            }else{
                console.log("mail not sent")
            }
        })
    }catch(err){
        console.log(err.message)
    }
}
module.exports = {
    mailsending,
    mailSending
}