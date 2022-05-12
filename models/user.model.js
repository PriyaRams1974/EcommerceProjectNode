'use strict';
const mongoose = require('mongoose');
const crypto = require('crypto');


const userSchema = mongoose.Schema({
    uuid:{type:String,require:false},
    name:{type:String,require:true,trim:true},
    role:{type: String, enum:['admin', 'user'], required:false ,default:'user'},
    email:{type:String,require:true},
    phone:{type:String,require:true},
    password:{type:String,require:true},
    address:{type:String,require:true},
    lastVisted:{type:String,require:false},
    loginStatus:{type:Boolean,require:false},
    otp:{type:String,require:false}
    
},
{
    timestamps:true
});



userSchema.pre('save',function(next){
    this.uuid = "USE"+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase();
    next();
});


module.exports = mongoose.model('user',userSchema);