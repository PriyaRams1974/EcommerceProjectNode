'use strict';

const mongoose = require("mongoose")
const crypto = require("crypto");

//creating product schema
const productSchema = new mongoose.Schema({
    uuid:{type:String,require:false},
    name:{type:String,require:true,trim:true},
    color:{type:String,require:true},
    cost:{type:Number,require:true},
    desc:{type:String,require:true},
    adminUuid:{type:String,require:true},
    categoryUuid:{type:String,require:true},
    InStock:{type:Number,require:true} 
},
{
    timestamps :true
});

//uuid generation code
productSchema.pre('save',function(next){
    try{
      this.uuid = 'PROD-'+crypto.pseudoRandomBytes(6).toString('hex');    
          next();
      }catch(error){
      console.log(error.message)
       }    
});

//product collection creation for productSchema
module.exports = mongoose.model('Product',productSchema,'Product');