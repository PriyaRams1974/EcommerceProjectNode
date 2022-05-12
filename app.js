const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { default: axios } = require('axios');
require('dotenv').config(); 

const app = express();
app.use(cors());
app.use(express.json())

app.get('/',async(req,res)=>{
    console.log('success');
    res.json({status:'success'});
});

axios.get('http://localhost:7070/api/v2/showAllitems').then(data =>{
   console.log(data.data)
}).catch(err =>{
    console.log(err)
})

app.listen(process.env.PORT1,()=>{
    console.log('server started......')
})
