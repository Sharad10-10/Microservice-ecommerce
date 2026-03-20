const express = require('express');
const router = express.Router();
const orderSchema = require('../models/orderLog')
const axios = require('axios')
const { sendOrderEvent } = require('../kafka/kafka')


router.post('/api/create-order', async(req, res)=> {

    const { products, customerEmail } = req.body

    try {

        if(!products || products.length === 0) {
            return res.status(400).json({message: 'Products are required!'})
        }

        const validProducts = []
        let calculatedTotal = 0;

        for (const item of products){

            try {
                const response = await axios.get(`http://localhost:3002/products/${item.productId}`)
                const product = await response.data

                if (!product){
                    res.status(400).json({message: `Product with id ${item.productId} not found!`})
                }

                if(product.stock < item.qty) {
                    return res.status(400).json({message: `Insufficient stock for product ${product.name}!`})
                }

                validProducts.push({
                    productId: product.productId,
                    name: product.name,
                    price: product.price,
                    quantity: item.qty
                })

                calculatedTotal += product.price * item.qty

            } catch (error) {
                return res.status(500).json({message: `Error fetching product with id ${item.productId}`})
            }

        }


        const order = new orderSchema({
            products: validProducts,
            totalAmount: calculatedTotal
        })

        await order.save()

        sendOrderEvent({
            products: validProducts,
            totalAmount: calculatedTotal,
            customerEmail
        })
        

        res.status(201).json({message: 'Order created successfully!', orderId: order._id})
        


    } catch (error) {
        return res.status(500).json(
            {message: 'Error processing order'}, 
            error
        )
    }





})


module.exports = router