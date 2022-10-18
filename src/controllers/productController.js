const {redis,validator,aws} = require("../utils")
const {productModel} = require("../models")

///////////==== NEW PRODUCT ====///////////////
const newProduct = async function(req,res){
    try{
        if(Object.keys(req.body).length==0){
            return res.status(400).send({status:false, message:"pls provide product details"}) 
        }

      
        let {title,description,price,currencyId,currencyFormat,isFreeShipping,style,availableSizes,installments,productImage}=req.body

        for(let key in req.body){
            if(req.body[key].trim().length==0){
                return res.status(400).send({status:false, message:`${key} can't be empty`})
            }
        }


        let mandatoryFields = ["title","description","price","availableSizes"]
        for(let key of mandatoryFields){
            if(!validator.isValid(req.body[key])){
                return res.status(400).send({status:false, message:`${key} must be present `}) 
            }
        }

        let lettersField = ["title","style"]
        for(let key in req.body){
            if(lettersField.includes(key) && !validator.isLetters(req.body[key])){
                return res.status(400).send({status:false,message:`${key} can only contain string of letters`})
            }
        }
        
        let numberfields = ["price","installments"]
        for(let key in req.body){
            if(numberfields.includes(key)){
                if(isNaN(req.body[key])){
                    return res.status(400).send({status:false,message:`${key} should be number`})
                }
            }
        }

        let currId = "INR"
        let currFormat = "₹"
        if(currencyId){
            if(currencyId!=currId){
                return res.status(400).send({status:false, message:"only Indian currencyId is valid"})
            }
        }
        if(currencyFormat){
            if(currencyFormat!=currFormat){
                return res.status(400).send({status:false, message:"only Indian currencyFormat is valid"})
            }
        }

        if(isFreeShipping){
            if(!(isFreeShipping.trim().toLowerCase()=="true"||isFreeShipping.trim().toLowerCase()=="false")){
                return res.status(400).send({status:false, message:"Type of isFreeShipping should be boolean"})
            }
        }

        if(availableSizes){
                let arr2 = ["S", "XS","M","X", "L","XXL", "XL"]
                    let arr = validator.makingArray(availableSizes.toUpperCase()) 
                    for (let i = 0; i < arr.length; i++) {
                        let x =arr[i]
                        if(!arr2.includes(x)){
                            return res.status(400).send({status:false , message : `only these ${arr2.join(",")} sizes are allowed`})
                        }
                    }
                    availableSizes = arr
                }

        const files = req.files

        if(files && files.length>0){
            const url = await aws.uploadFile(files[0])
            productImage = url
        }
        else{
            return res.status(400).send({status:false, message:"no file found"})
        }

        // uniqueness of title
        const duplicateData= await productModel.findOne({title})
        if(duplicateData){
            return res.status(409).send({status:false, message:"Title is already taken"})
        }
        const data = {title,description,price,currencyId,currencyFormat,isFreeShipping,style,availableSizes,installments,productImage}

        const newProduct = await productModel.create(data)

        return res.status(201).send({status:true, message:"Success", data:newProduct})

    }catch(err){  
        return res.status(500).send({status:false, message:err.message})    
    }
}

///////////==== UPDATE PRODUCT ====///////////////
const updateProduct = async function(req,res){
    try{
        const productId = req.params.productId

        if(!validator.isValidObjectId(productId)){
            return res.status(400).send({status:false, message:"Invalid productId"})
        }
        if(!(Object.keys(req.body).length!=0 || req.files)){
            return res.status(400).send({status:false, message:"pls provide product details for updation"}) 
        }

        let {title,description,price,currencyId,currencyFormat,isFreeShipping,style,availableSizes,installments,productImage}=req.body

        let filter = {}
        if(title){
            if(!validator.isLetters(title)){
                return res.status(400).send({status:false, message:"Title can only contain string of letters "})
            }
            const dupData= await productModel.findOne({title})

            if(dupData){
                return res.status(409).send({status:false, message:"Title is already taken"})
            }
            filter.title = title
        }
        if(description){
            if(!validator.isValid(description)){
                return res.status(400).send({status:false, message:"pls proide value for description"})
            }
            filter.description = description
        }
        if(price){
            price=Number(price)
            if(typeof price != "number"){
                return res.status(400).send({status:false, message:"Price should be type number"})
            }
            filter.price = price
        }
        if(currencyId){
            let currId = "INR"
            if(currencyId!=currId){
                return res.status(400).send({status:false, message:"only Indian currencyId is valid"})
            }
            
        }
        if(currencyFormat){
            let currFormat = "₹"
            if(currencyFormat!=currFormat){
                return res.status(400).send({status:false, message:"only Indian currencyFormat is valid"})
            }
            
        }
        if(isFreeShipping){
           
            if(!(isFreeShipping.trim().toLowerCase()=="true"||isFreeShipping.trim().toLowerCase()=="false")){
                return res.status(400).send({status:false, message:"Type of isFreeShipping should be boolean"})
            }
            filter.isFreeShipping = isFreeShipping
        }
        if(style){
            if(!validator.isLetters(style)){
                return res.status(400).send({status:false, message:"Style should be a string and not empty"})
            }
            filter.style = style
        }
      
        if(availableSizes){
            let arr2 = ["S", "XS","M","X", "L","XXL", "XL"]        
            let arr = validator.makingArray(availableSizes.toUpperCase())            
            for (let i = 0; i < arr.length; i++) {
                let x =arr[i]
                if(!arr2.includes(x)){
                    return res.status(400).send({status:false , message : `only these ${arr2.join(",")} sizes are allowed`})
                }
            }
            filter.$addToSet = {availableSizes:[...arr]}                   
        }

        if(installments){
            installments=Number(installments)
            if(typeof installments !== "number"){
                return res.status(400).send({status:false, message:"Type of installment should be number"})
            }
            filter.installments = installments
        }

        const files = req.files

        if(files && files.length>0){
            const url = await aws.uploadFile(files[0])
            filter.productImage = url
        }
        

        const updatedProduct = await productModel.findOneAndUpdate({_id:productId,isDeleted:false},filter,{new : true})

        return res.status(200).send({status:true, message:"Product updated successfully", data:updatedProduct})

    }catch(err){  
        return res.status(500).send({status:false, message:err.message})    
    }
}

///////////==== GET PRODUCT BY ID ====///////////////
const getById = async function(req,res){
    try{
        const productId = req.params.productId
        if(!validator.isValidObjectId(productId)){
            return res.status(400).send({status:false, message:"Invalid productId"})
        }

        const product = await productModel.findOne({_id:productId, isDeleted:false})
        if(!product){
            return res.status(404).send({status:false,message:"no product found"})
        }

        return res.status(200).send({status:true,message:"Success", data:product})
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

///////////==== DELETE PRODUCT ====///////////////
const deleteProduct = async function(req,res){
    try{
        const productId = req.params.productId
        if(!validator.isValidObjectId(productId)){
            return res.status(400).send({status:false, message:"Invalid productId"})
        }

        const dProduct = await productModel.findOneAndUpdate({_id:productId,isDeleted:false},{isDeleted:true, deletedAt:new Date()})
        if(!dProduct){
            return res.status(404).send({status:false, message:"product does not exist"})
        }
        return res.status(200).send({status:true,message:"deleted Successfully"})
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

///////////==== GET PRODUCT BY PARAMS ====///////////////
const getByQuery = async function(req,res){
    try{
        let params = req.query 
        
        let {size,name,priceGreaterThan,priceLessThan,priceSort}=params

        let availParams = ["size","name","priceGreaterThan","priceLessThan","priceSort"]
        for(let key in params){
            if(!availParams.includes(key)){
                return res.status(400).send({status:false, message:`Query params can only be-${availParams.join(",")}`})
            }
        }

        for(let key in params){
            if(!validator.isValid(params[key])){
                return res.status(400).send({status:false, message:`${key} can't be empty`})
            }
        }

        if(size){
            let arrayOfSizes = validator.makingArray(size.toUpperCase())
          
            for(let i=0;i<arrayOfSizes.length;i++){
                let arr=["S","XS","M","X","L","XXL", "XL"]
                if(!arr.includes(arrayOfSizes[i])){
                    return res.status(400).send({status:false, message:`size can only be from-${arr.join(",")}`})
                }
            }
            params.availableSizes={$in:[...arrayOfSizes]} 
        }
      
        if(name){
            name=name.trim()
            if(!validator.isLetters(name)){
                return res.status(400).send({status:false, message:"product name can only contains letters"})
            }
            params.title={$regex:name, $options:"i"}
        }

        let arr=[priceGreaterThan,priceLessThan]

        if(priceLessThan && priceGreaterThan){
            params.$and=[{price:{$gt:priceGreaterThan}} , {price:{$lt:priceLessThan}}]
        }
        else{
            if(priceGreaterThan){
               
                params.price={$gt:priceGreaterThan}
            }
            else if(priceLessThan){
                
                params.price={$lt:priceLessThan}
            }
        }

        if(priceSort){
         
            if(!(priceSort == 1 || priceSort == -1)){
                return res.status(400).send({status:false, message:"priceSort can be -1 or 1"})
            }
        }
        params.isDeleted=false
        
        const product = await productModel.find(params).sort({price:priceSort||1})
        
        if(product.length==0){
            return res.status(404).send({status:false, message:"no product found"})
        }
        const num = product.length
        return res.status(200).send({status:true, message:`products-${num}`, data:product})
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    
    }
}





module.exports={
    newProduct,
    getById,
    deleteProduct,
    getByQuery,
    updateProduct
    
}