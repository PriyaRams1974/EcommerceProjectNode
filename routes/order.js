const productSchema = require('../models/product.model');
const userSchema = require('../models/user.model')
const CartSchema = require('../models/cart.model');
const router = require('express').Router();


router.get('/getAll',async(req,res)=>{
     try{
        const items = CartSchema.find().then(data=>{
            res.json({status:"success",data})
        }).catch(err=>{
            res.json({status:'failure'})
        })
     }catch(err){
         res.json({})
     }

})
router.get('/search', async(req,res)=>{
    try{
        const data = await productSchema.find({ name : {$regex: req.query.name, $options:"i"}}).exec();
        if(data){
            res.json({status:'success',data});
        } else{
            res.json({status:'failure'});   
        }
    }catch(err){
        res.json({'err':err.message})
    }
    })

    router.post('/addToCart',async(req,res)=>{
        try{
            const {itemsUuid, quantity,cost} = req.body
            const userUuid = req.query.userUuid
            const addCart = new CartSchema(req.body)
            let cart = await CartSchema.findOne({userUuid:userUuid}).exec();
            if(cart){
                let data = cart.items
                let item = data.findIndex(index=>index.itemsUuid==itemsUuid)
               console.log("items",item)
     
                if(item>-1){
                    let NewItems = cart.items[item];
                    console.log("new",NewItems);
                    NewItems.quantity = quantity;
                    cart.items[item] = NewItems; 
     
                    NewItems.cost = cost * NewItems.quantity;
     
                    let total = NewItems.cost
                    console.log(total);
                 
                }else{
                    cart.items.push({itemsUuid, quantity,cost});
                }
                cart = await cart.save();
                //console.log(cart);
                res.json({status:'success',"result":cart})
            }else{
                let NewCart = await CartSchema.create({userUuid,items:[{itemsUuid,quantity,cost}]})
                res.json({status:'failure',message:'not avalible',NewCart});
            }
        }catch(err){
            console.log(err.message);
            res.json({'err':err.message})
        }
     
     })

router.get('/cart',async(req,res)=>{
    try{
        const uuid = req.query.uuid
        let data = await CartSchema.findOne({uuid:uuid})
        if(data){
            let result = data.items.length
            let total = data.items
            console.log(total[0].cost);
            let totalPrice =0;
            for(let i = 0;i<result;i++){
             totalPrice += total[i].cost
            
            }
            console.log("total",totalPrice);

            const updated = await CartSchema.findOneAndUpdate({uuid:uuid},{totalPrice:totalPrice},{new:true}).exec();
            if(updated){
                res.json({status:'success',updated})
            }
            
        }else{
            res.json({status:'failure'})
        }

        let userUuid = req.body.userUuid

       
    }catch(err){
        res.json({"err":err.message})
    }
})


router.get('/proceed',async(req,res)=>{
    try{
        const uuid = req.query.uuid
        await userSchema.findOne({uuid:uuid}).exec().then(data=>{
            const address = data.address
            CartSchema.findOneAndUpdate({userUuid:uuid},{status:'pending',address:address},{new:true}).exec().then(result=>{
            console.log(result.address);
            res.json({status:'success',message:'your order successed',result}) 
           })

        })
    }catch(err){
        res.json({'err':err.message})
    }
})

router.get('/cancel',async(req,res)=>{
    try{
        const uuid = req.body.uuid
        await CartSchema.findOneAndUpdate({userUuid:uuid},{status:'cancelled'},{new:true}).exec().then(data=>{
            res.json({status:'success',message:'order is cancelled',data})
        }).catch(err=>{
            res.json({message:err.message})
        })
    }catch(err){
        console.log(err.message);
        res.json({'error':err.message})
    }
})

router.delete("/delete", async (req, res) => {
    try {
      const uuid = req.query.uuid
      await CartSchema.findOneAndDelete(uuid);
      res.json({status:'Order has been deleted...'});
    } catch (err) {
      res.json(err);
    }
  });


module.exports =router
