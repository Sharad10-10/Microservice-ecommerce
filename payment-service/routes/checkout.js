const express = require('express')
const router = express.Router()
const dotenv = require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)



router.post('/create-session', async(req, res)=>{




    const {customerEmail, cartItems, userId, totalAmount} = req.body

    console.log('Received checkout request:', {customerEmail, cartItems, userId, totalAmount})

   try {
    if(!cartItems || cartItems.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Failed! Cart items are required'
        })
    }


    const calculateTax = cartItems.reduce((sum, cartItem) => {

        return sum + (((cartItem.price * 100) * cartItem.quantity )* 0.13)

    },0)


    const lineItems = cartItems?.map(cartItem => ({

        price_data : {
            currency : 'usd',
            product_data : {
                name: cartItem?.name,
                images: [cartItem?.image]
            },
            unit_amount: Math.round(cartItem?.price * 100) 
          },
          quantity : cartItem?.quantity

    }
))

    lineItems.push({
        price_data : {
        currency : 'usd',
        product_data : {
            name: 'Shipping Fee',
        },
        unit_amount: 500 
        },
        quantity : 1
        },

        {

            price_data : {
                currency : 'usd',
                product_data : {
                    name: 'Tax(13%)'
                },

                unit_amount : 
                Math.round(calculateTax)
             },
             quantity : 1

        }

)

  


    const session = await stripe.checkout.sessions.create({

        payment_method_types: ['card'],
        line_items : lineItems,
        mode: 'payment',
        success_url : `${process.env.FRONTEND_URL}/checkout/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url : `${process.env.FRONTEND_URL}/checkout/payment-cancel`,
        metadata: {
            userId: userId,
            cartItems: JSON.stringify(cartItems.map(cartItem => ({
                productId: cartItem?.productId,
                name: cartItem?.name,
                price: cartItem?.price,
                quantity: cartItem?.quantity
            }))),
            customerEmail,
            totalAmount
           
           

        },
      

    })

    return res.status(200).json({
        success: true,
        message: 'Checkout processed',
        sessionUrl: session?.url,
        sessionId: session?.id,

    })


   } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to process the payment',
            error: error.message
        })
   }

})


router.get('/session/:sessionId', async(req, res)=> {

    try {

        
        const { sessionId } = req.params

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items', 'payment_intent']
        })

        console.log(session)

        return res.status(200).json({
            success: true,
            message: 'Session retrieved successfully',
            id: session?.id,
            paymentStatus: session.payment_status,
            totalAmount: session.amount_total / 100,
            currency: session.currency,
            metadata: session.metadata,
            lineItems: session.line_items?.data || [],
            createdAt: new Date(session.created * 1000)

        })




    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to get session',
            error: error.message
        })
    }


})


module.exports = router