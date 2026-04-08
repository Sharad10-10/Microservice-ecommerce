const express = require('express')
const router = express.Router()
const dotenv = require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { sendOrderEvent } = require('../kafka/kafka')
const connectDb = require('../db/dbConfig')
const CartModel = require('../../cart-service/models/cartSchema')



router.post('/', express.raw({type: 'application/json'}), async(req, res) => {

    const sig = req.headers['stripe-signature']
    let event;
    const { cartDB } = await connectDb()
    const Cart = cartDB.model('cart', CartModel.cartSchema)

    try {

        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET_KEY
        )
        
    } catch (error) {
        return res.status(500).json({

            success: false,
            message: 'Error! Webhook signature verification failed',
            error: error.message
        })
    }

    switch(event.type) {
        case 'checkout.session.completed':
            const session = event.data.object

            const userId = session.metadata.userId

            const sessionMetadata  = session.metadata
                   

            try {

                const items = JSON.parse(session.metadata.cartItems || '[]')
                const total = parseFloat(session.metadata.totalAmount) || (session.amount_total / 100)

                const orderData = {
                    products: items.map(item => ({
                        productId : item.productId,
                        name : item.name,
                        price: item.price,
                        qty: item.quantity

                    })),
                    customerEmail: sessionMetadata.customerEmail,
                    totalAmount: total,
                    stripeSessionId: session.id,
                    paymentStatus: 'PAID',
                    status: 'PAID',
                    userId: userId
                }


                const orderResponse = await fetch(`${process.env.ORDER_SERVICE_URL}/api/orders/create-from-payment`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(orderData)
                    }
                )

                const data = await orderResponse.json()

                if(sendOrderEvent) {
                    await sendOrderEvent({
                        ...data,
                        totalAmount: total,
                        customerEmail: data?.customerEmail || sessionMetadata?.customerEmail
                    })
                }

                const clearCart = await Cart.findOneAndUpdate({ userId }, {$set : {cartItems : [], totalAmount: 0}},{returnDocument: 'after'})
            

            } catch (error) {

                console.log('Error creating order with stripe', error.message)
                
            }
        break

        case 'checkout.session.expired': 
            console.log('Checkout session expired:',event.data.object.id);
        break

        default: 
            console.log(`Unhandled event type:${event.type}`)

    }

    res.status(200).json({
        success: true,
        message: 'Order created',
        received: true
    })

})

module.exports = router;