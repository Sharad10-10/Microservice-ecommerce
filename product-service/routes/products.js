const express = require('express');
const router = express.Router();
const productSchema = require('../models/product')



router.get('/all-products', async(req, res)=> {



    try {
        
        const products = await productSchema.find()
        return res.json(products)
    
    }

        catch (error) {
            return res.status(500).json({message: 'Error fetching products!'}, error)
        }



})



router.get('/all-products/:id', async(req, res)=> {

    console.log(req.params.id)

    const {id} = await req.params

    try {
        
        const product = await productSchema.findById(id)
        if(!product){
            return res.status(404).json({message: 'Product not found!'})
        }

       return res.json(product)


    

    } catch (error) {
        return res.status(500).json({message: 'Error fetching product!'}, error)
    }

})

module.exports = router