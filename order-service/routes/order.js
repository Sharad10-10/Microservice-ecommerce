const express = require('express');
const router = express.Router();
const orderSchema = require('../models/orderLog')
const axios = require('axios')
const { sendOrderEvent } = require('../kafka/kafka')


router.post('/create-order', async(req, res)=> {

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


router.post('/create-from-payment', async(req, res) => {


    try {
        const orderData = req.body
        console.log('Order data received', orderData)

  

        const { products, totalAmount, stripeSessionId, paymentStatus, status, userId, customerEmail } = orderData

        if(!customerEmail) {
            return res.status(400).json({
                success: false,
                message: 'Failed! Customer email is required'
            })
        }

        const existingOrder = await orderSchema.findOne({stripeSessionId})
        if(existingOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order already exists for this payment session'
            })
        }

        const order = new orderSchema({

            products: products.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                qty: item.qty
            })),
            totalAmount,
            stripeSessionId,
            paymentStatus,
            status
        })

        await order.save()

        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order,
            customerEmail
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating order from payment',
            error: error.message
        })
    }



})


router.get('session/:sessionId', async(req, res) => {

    const { sessionId } = req.params

    try {
        
        const order= await orderSchema.findOne({ stripeSessionId: sessionId })

        if(!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Order retrieved successfully',
            order

        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to get order data',
            error: error.message
        })
    }




})


module.exports = router