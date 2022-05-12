const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); 
const user = require('./routes/user.route')
const Products = require('./routes/product.route'); 
const { required } = require('joi');
const order = require('./routes/order');


const app = express();
app.use(cors());
app.use(express.json())

app.get('/',async(req,res)=>{
    console.log('success');
    res.json({status:'success'});
});

let dburl = process.env.dbUrl
mongoose.connect(dburl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(db =>{
    console.log('dataBase connected start.....')
}).catch(err=>{
    console.log(err.message);
    process.exit(1);
})

app.use('/api/v1',user)
app.use('/api/v2',Products)
app.use('/api/v3',order)
const { default: axios } = require('axios');

// app.use('/api/v4',cart)

// axios.get('http://localhost:8000/').then(data =>{
//    console.log(data.data)
// }).catch(err =>{
//     console.log(err)
// })

app.listen(process.env.PORT,()=>{
    console.log('server started......')
})
