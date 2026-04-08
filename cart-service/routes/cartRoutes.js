const express = require('express')
const router = express.Router()
const cartSchema = require('../models/cartSchema')
const authMiddleware = require('../../auth-service/middleware/authMiddleware')


router.get('/my-cart', authMiddleware, async(req, res)=> {

    const userId  = req.userId
    const userEmail = req.email
  
    try {

        const cart = await cartSchema.findOne({ userId })

        if(!cart) {
            return res.status(400).json({
                userId,
                cartItems : [],
                totalAmount: 0,
                cartCount: 0
            })
        }

        const itemCount = cart.cartItems.reduce((sum, items)=> sum + items.quantity, 0)
        const total = cart.cartItems.reduce((sum, items)=> sum + (items.quantity * items.price), 0)

        return res.status(200).json({
            success: true,
            message: 'Cart items fetched successfully',
            userId: cart.userId, cartItems: cart.cartItems, totalAmount: Math.round(total * 100) / 100, cartCount: itemCount, userEmail
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to get cart items'
        })
    }
})



router.post('/add', authMiddleware, async(req, res)=> {
   
    const userId  = req.userId 

    const { productId, name, price, quantity, image } = req.body

    try {

        if(!productId || !name || !price || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'Product id, name, price and quantity are required to create a cart'
            })
        }

        let cart = await cartSchema.findOne({userId})

        if(!cart){
            cart = new cartSchema({
                userId,
                cartItems: [{
                    productId,
                    name,
                    price,
                    quantity,
                    image
                }],
             
            })
        }
        else {
            const itemExists = cart.cartItems.findIndex((item)=> item.productId == productId)

            if(itemExists > -1) {
                cart.cartItems[itemExists].quantity += quantity
            }
            else {
                cart.cartItems.push({
                    productId,
                    name,
                    price,
                    quantity,
                    image
                })
            }
        }


        const itemsCount = cart.cartItems.reduce((sum, item)=> sum + item.quantity,0)
        const total = cart.cartItems.reduce((sum, item)=>sum + (item.quantity * item.price), 0)

        cart.totalAmount = total

        await cart.save()


        return res.status(200).json({
            success: true,
            message: 'Items added to cart successfully',
            userId,
            itemsCount,
            total
        })


    }
    
    catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: 'Failed to add items to cart',
            error
        })
    }



})



router.put('/update/:productId', authMiddleware, async(req, res)=> {

    const { productId } = req.params
    const userId  = req.userId  
    const { quantity } = req.body

    try {
        
        const cart = await cartSchema.findOne({userId})

        if(!cart){
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            })
        }

        const itemExists = cart.cartItems.findIndex((item)=>item.productId == productId)

      if(itemExists == -1) {
        return res.status(404).json({
            success: false,
            message: 'Item does not exists in the cart'
        })
      }
      
      if(quantity <= 0){
        cart.cartItems.splice(itemExists, 1)
      }
      else {
        cart.cartItems[itemExists].quantity = quantity
      }

      await cart.save()

      return res.status(200).json({
        success: true,
        message: 'Cart updated',
        cart
      })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update cart items',
            error
        })
    }

})


router.delete('/delete/:productId', authMiddleware ,async(req, res)=> {


    const {productId} = req.params

    const userId = req.userId
    
    try {
        
        if(!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: 'Product associated with user is required'
            })
        }

        const cart = await cartSchema.findOne({ userId })

        if(!cart) {
            return res.status(400).json({
                success: false,
                message: 'No cart found to delete'
            })
        }

        const itemExists = cart.cartItems.findIndex((item)=> item.productId == productId)

        if(itemExists == -1) {
            return res.status(400).json({
                success: false,
                message: 'No items found in the cart'
            })
        }

        cart.cartItems.splice(itemExists, 1)
        await cart.save()

        const itemsCount = cart.cartItems.reduce((sum, item)=> sum + item.quantity)
        const total = cart.cartItems.reduce((sum, item)=> sum + (item.quantity * item.price))

        return res.status(200).json({
            success: true,
            message: 'Item deleted from cart',
            userId: cart.userId,
            cartItems: cart.cartItems,
            itemsCount,
            total
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product from cart',
            error
        })
    }







})



module.exports = router


