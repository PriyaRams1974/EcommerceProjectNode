'use strict';

const mongoose = require("mongoose")
const crypto = require('crypto')

const Cartschema = new mongoose.Schema({
    userUuid: { type:String,required:true},
    items :[
        {
            itemsUuid:String,
            quantity:Number,
            cost:Number,
        },
    ],
    uuid:{type:String,required:false},
    totalPrice:{type:Number,required:false},
    address:{type:String,required:false},
    status:{type:String,required:false}
    
},{
    timestamps:true
})


Cartschema.pre('save',function(next){
    this.uuid = 'Ord'+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    console.log(this.uuid)
    next()
    
})

module.exports = mongoose.model("cart", Cartschema)