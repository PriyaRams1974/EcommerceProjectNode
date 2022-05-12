'use strict';
const mongoose = require("mongoose");
const crypto = require('crypto');

const categorySchema = new mongoose.Schema({
    uuid:{type: String, required: false},
    categoryName: {type: String, required: true, trim: true},
    categoryDesc: {type: String, required: false, trim: true},
    adminUuid: {type: String, required: true}
},
{
    timestamps: true
});


//uuid generation code
categorySchema.pre('save',function(next){
    try{
      this.uuid = 'CATE-'+crypto.pseudoRandomBytes(6).toString('hex');    
          next();
      }catch(error){
      console.log(error.message)
       }    
});
module.exports=mongoose.model('category',categorySchema, 'category');