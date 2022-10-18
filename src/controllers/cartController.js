const {default: mongoose } = require("mongoose")
const {cartModel,userModel,productModel}=require("../models")

const {redis,validator,aws}=require("../utils")

const createCart = async function(req,res){
    try{

        const userId = req.params.userId

        if(!validator.isValidObjectId(userId)){
            return res.status(400).send({status:false, message:"Invalid userId"})
        }
        if(req.userId!=userId){
            return res.status(403).send({status:false, message:"unauthorization"})
        }
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(400).send({status:false, message:"no user found"})
        }

        if(!validator.isValidObject(req.body)){
            return res.status(400).send({status:false, message:"pls provide data to create cart"}) 
        }
        let {cartId,productId}=req.body

        
        if(!productId){
            return res.status(400).send({status:false, message:"productId is mandatory"})
        }
        if(!validator.isValidObjectId(productId)){
            return res.status(400).send({status:false, message:"Invalid productId"})
        }

        const product = await productModel.findOne({_id:productId,isDeleted:false}).lean().select({title:1,price:1,productImage:1})
        if(!product){
            return res.status(400).send({status:false, message:"No product found"})
        }
        const cart = await cartModel.findOne({userId}).lean()
        if(cart){
            if(!cartId){
                return res.status(400).send({status:false, message:"cartId is mandatory"})
            }
            if(!validator.isValidObjectId(cartId)){
                return res.status(400).send({status:false, message:"Invalid cartId"})
            }
            if(cartId!=cart._id){
                return res.status(400).send({status:false, message:"different cartId is present"})
            }

            let {items,totalItems,totalPrice}=cart
            let flag = true

            for(let i=0;i<items.length;i++){
                if(items[i].productId==productId){
                    flag=false
                    items[i].quantity++
                }
            }
            if(flag){
                let obj={
                    productId:productId,
                    quantity:1
                }
                items.push(obj)
            }
            totalPrice+=product.price
            totalItems=items.length
            const updatedCart = await cartModel.findByIdAndUpdate(cartId,{$set:{items,totalPrice,totalItems}},{new:true}).populate("items.productId","title price productImage")
            
            return res.status(201).send({status:true, message:"Success", data:updatedCart})
        }
        else{
            let obj={}
            obj.userId = mongoose.Types.ObjectId(userId)

            obj.items= [{
                productId:productId,
                quantity:1
            }]
            obj.totalItems=1
            obj.totalPrice=product.price
            const newCart = await cartModel.create(obj)
            let newObj = JSON.parse(JSON.stringify(newCart))
            newObj.items[0].productId=product
            return res.status(201).send({status:true, message:"Success", data:newObj})
        }
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

const updateCart = async function(req,res){
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
            return res.status(400).send({status:false, message:"no user found"})
        }

        const {cartId,productId,removeProduct}=req.body

        const mandField =["cartId","productId","removeProduct"]
        for(let key of mandField){
            if(!validator.isValid(req.body[key])){
                return res.status(400).send({status:false, message:`${key} is required`})
            }
        }

        const idS = ["cartId","productId"]
        for(let key of idS){
            if(!validator.isValidObjectId(req.body[key])){
                return res.status(400).send({status:false, message:`Invalid ${key}`})
            }
        }

        const product = await productModel.findOne({_id:productId, isDeleted:false})
        if(!product){
            return res.status(400).send({status:false, message:`no product found`})
        }

        const cart = await cartModel.findById(cartId)
        if(!cart){
            return res.status(400).send({status:false, message:"no cart found"})
        }

        if(removeProduct==0){
            let {items,totalItems,totalPrice} = cart
            let flag = true
            for(let i=0;i<items.length;i++){
                if(items[i].productId==(productId)){
                    flag =false
                    totalPrice -= product.price*items[i].quantity
                    items.splice(i,i+1)
                }
            }
            totalItems = items.length
            if(flag){
                return res.status(400).send({status:false, message:"this product was not added in cart"})
            }
            const updatedCart = await cartModel.findByIdAndUpdate(cartId,{$set:{items,totalItems,totalPrice}},{new:true}).populate("items.productId","title price productImage")
            return res.status(200).send({status:true, data:updatedCart})
        }

        else if (removeProduct==1){
            let {items,totalItems,totalPrice} = cart
            let flag = true
            for(let i=0;i<items.length;i++){
                if(items[i].productId==productId){
                    flag =false
                    items[i].quantity=items[i].quantity-1
                    totalPrice -= product.price
                    if(items[i].quantity==0){
                        items.splice(i,i+1)
                    }
                }
            }
            totalItems = items.length
            if(flag){
                return res.status(400).send({status:false, message:"this product was not added in cart"})
            }
            const updatedCart = await cartModel.findByIdAndUpdate(cartId,{$set:{items,totalItems,totalPrice}},{new:true}).populate("items.productId","title price productImage")
            return res.status(200).send({status:true, data:updatedCart})
        }
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

const getCart = async function(req,res){
    try{
        const userId = req.params.userId
        if(!validator.isValidObjectId(userId)){
            return res.status(400).send({status:false, message:"Invalid userId"})
        }

        if(req.userId!=userId){
            return res.status(403).send({status:false, message:"unauthorization"})
        }

        const user = await userModel.findById(userId).lean()
        if(!user){
            return res.status(404).send({status:false, message:"no user found"})
        }

        const cart = await cartModel.findOne({userId}).populate("items.productId","title price productImage")
        if(!cart){
            return res.status(404).send({status:false, message:"no cart found"})
        }

        return res.status(200).send({status:true, message:"Success", data:cart})
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

const deleteCart = async function(req,res){
    try{
        const userId = req.params.userId
        if(!validator.isValidObjectId(userId)){
            return res.status(400).send({status:false, message:"Invalid userId"}) 
        }

        if(req.userId != userId){
            return res.status(403).send({status:false, message:"unauthorized"})
        }

        const user = await userModel.findById(userId)
        if(!user){
            return res.status(400).send({status:false, message:"No user found"}) 
        }
        const obj={
            items:[],
            totalItems:0,
            totalPrice:0
        }
        const cart = await cartModel.findOneAndUpdate({userId},{$set:obj},{new:true}) 
       
        if(!cart){
            return res.status(404).send({status:false, message:"no cart found"})
        }
        
        return res.status(204).send()

    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

module.exports={
    createCart,
    updateCart,
    getCart,
    deleteCart
}