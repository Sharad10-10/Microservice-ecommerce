const express = require('express')
const router = express.Router()
const dotenv = require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const sendOrderEvent = require('../kafka/kafka')


router.post('/', express.raw({type: 'application/json'}), async(req, res) => {

    const sig = req.headers['stripe-signature']
    let event;

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

            try {
                const items = JSON.parse(session.metadata.items || '[]')
                const total = parseFloat(session.metadata.total) || (session.amount_total / 100)

                const orderData = {
                    products: items.map(item => ({
                        productId : item.productId,
                        name : item.name,
                        price: item.price,
                        quantity: item.quantity

                    })),
                    customerEmail: session.customer_email,
                    total: total,
                    stripeSessionId: session.id,
                    paymentStatus: 'PAID',
                    status: 'CONFIRMED'
                }

                const orderResponse = await fetch(`${process.env.ORDER_SERVICE_URL}/orders/create-from-payment`,
                    orderData
                )

                if(sendOrderEvent) {
                    await sendOrderEvent({
                        ...orderResponse.data,
                        totalAmount: total
                    })
                }

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