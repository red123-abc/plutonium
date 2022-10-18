const {default: mongoose } = require("mongoose")
const {cartModel,userModel,productModel,orderModel}=require("../models")

const {redis,validator,aws}=require("../utils")

const createOrder = async function(req,res){
    try{
        const userId = req.params.userId
        if(!validator.isValidObjectId(userId)){
            return res.status(400).send({status:false, message:"Invalid userId"})
        }
        if(req.userId!=userId){
            return res.status(403).send({status:false, message:"unauthorized"})
        }
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(403).send({status:false, message:"no user found"})
        }

        if(!validator.isValidObject(req.body)){
            return res.status(400).send({status:false, message:"pls provide cart details"})
        }
        const {cartId,cancellable,status}=req.body
        if(!cartId){
            return res.status(400).send({status:false, message:"cartId is mandatory"})
        }
        // if(cancellable){
        //     if(!((" "+cancellable).trim()=="true" || (" "+cancellable).trim()=="false" )){
        //         return res.status(400).send({status:false, message:"Cancellable can only be boolean value"})
        //     }
            
        // }
        // if(status){
        //     let arr=["pending", "completed", "canceled"]
        //     for(let key of arr){
        //         if(!arr.includes(status)){
        //             return res.status(400).send({status:false,message:`status value can be only - ${arr.join(",")}`})
        //         }
        //     }
        //     if(status=="canceled" && (" "+cancellable).trim()=="false"){

        //     }
        // }

        const cart = await cartModel.findById(cartId).lean().select({_id:0,userId:1,items:1,totalPrice:1,totalItems:1})
        if(!cart){
            return res.status(400).send({status:false, message:"cart not found"})
        }
        if(cart.userId!=userId){
            return rea.status(403).send({status:false, message:"unauthorized"})
        }

        let totalQuantity=0
        cart.items.forEach(x=>totalQuantity+=x.quantity)

        cart.totalQuantity=totalQuantity
        const newOrder = await orderModel.create(cart)
        return res.status(201).send({status:true, message:"Success", data:newOrder})

    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

const updateOrder = async function(req,res){
    try{
        const userId = req.params.userId
        if(!validator.isValidObjectId(userId)){
            return res.status(400).send({status:false, message:"Invalid userId"})
        }
        if(req.userId!=userId){
            return res.status(403).send({status:false, message:"unauthorized"})
        }
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(403).send({status:false, message:"no user found"})
        }

        if(!validator.isValidObject(req.body)){
            return res.status(400).send({status:false, message:"pls provide order details"})
        }
        let {orderId,status}=req.body
        if(!orderId){
            return res.status(400).send({status:false, message:"pls provide order details to update"})
        }
        if(!validator.isValidObjectId(orderId)){
            return res.status(400).send({status:false, message:"Invalid orderId"})
        }
        if(!status){
            return res.status(400).send({status:false, message:"pls provide status"})
        }

        let arr=["pending", "completed", "canceled"]
        if(!arr.includes(status.trim().toLowerCase())){
            return res.status(400).send({status:false, message:`status can be only -${arr.join(",")}`})
        }
        status=status.trim().toLowerCase()
        if(status=='canceled'){
            const order = await orderModel.findOneAndUpdate({_id:orderId,cancellable:true,status:{$ne:"completed"}},{status},{new:"true"})
            if(!order){
                return res.status(400).send({status:false, message:"order is non cancellable or order is already completed"})
            }
            if(order.userId!=userId){
                return res.status(400).send({status:false, message:"can't update other user's order"})
            } 
            return res.status(200).send({status:true, message:"Success", data:order})
        }
        else{
            const order = await orderModel.findOneAndUpdate({_id:orderId,status:{$ne:"completed"}},{status},{new:"true"})
            if(!order){
                return res.status(400).send({status:false, message:"no order found or order is already completed"})
            }
            if(order.userId!=userId){
                return res.status(400).send({status:false, message:"can't update other user's order"})
            } 
            return res.status(200).send({status:true, message:"Success", data:order})
        }

    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

module.exports={
    createOrder,
    updateOrder
}