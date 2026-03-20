const express = require('express')
const router = express.Router()
const userSchema = require('../models/userSchema')
const bcrypt = require('bcryptjs')
const { sendNewUserEvent } = require('../kafka/kafka')
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/authMiddleware')




router.post('/register', async(req, res)=> {

    const {userName, email, password} = req.body

    console.log(userName, email, password)


    try {
        
        if(!userName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all the necessary fields!'
            })
        }

        const existingUser = await userSchema.findOne({$or: [{email} , {userName}]})

        if(existingUser) {
            return res.status(400).json({
                message: 'User already exists',
                user: {userName: existingUser.userName, email: existingUser.email}
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = uuidv4()

        const user = await userSchema.create({
            userName,
            email,
            password: hashedPassword,
            verificationToken
        })

        sendNewUserEvent({
            userName,
            email,
            verificationToken,
            createdAt: new Date()
        })

        return res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check email for verification',
            user: {userName: user.userName, email: user.email}
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to register user',
            error
        })
    }

})


router.get('/verify-email/:token', async(req, res)=> {

    const { token } = req.params
    console.log(token)

  try {
    const user = await userSchema.findOne({verificationToken: token})

    if(!user){
        return res.status(404).json({
            success: false,
            message: 'Failed to verify user'
        })
    }

    user.isVerified = true
    user.verificationToken = null
    await user.save()

    return res.status(200).json({
        success: true,
        message: 'User verified successfully...'
    })



  } catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Failed to verify! Server error'
    })
  }

})



router.post('/login', async(req, res)=> {

    const {email, password} = req.body

    try {
        
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: 'Please provide all the necessary fields!'
            })
        }

        const existingUser = await userSchema.findOne({email})

        if(!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User does not exists! Please check your credentials.'
            })
        }

        if(!existingUser?.isVerified){
            return res.status(400).json({
                success: false,
                message: 'Please verify your email and proceed!'
            })
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser?.password)

        if(!isPasswordValid){
            return res.status(400).json({
                success: false,
                message: 'Login failed! Please check your credentials.'
            })
        }

        const accessToken = jwt.sign(
            {id: existingUser._id,
                userName: existingUser?.userName,
                email: existingUser?.email
            },
            process.env.JWT_SECRET,
            {expiresIn : '20m'}
        )

        const refreshToken = jwt.sign(
            {id: existingUser._id,
                userName: existingUser?.userName,
                email: existingUser?.email
            },
            process.env.REFRESH_SECRET,
            {expiresIn: '7d'}
        )

        existingUser.refreshToken = refreshToken
        await existingUser.save()


        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            domain: 'localhost',
            path: '/',
            sameSite: 'lax',
            maxAge: 20 * 60 * 1000
        })


        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            domain: 'localhost',
            path: '/',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: 'Login Successful',
            user: {email:existingUser?.email, userName: existingUser?.userName}
        })

    } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Failed to login! Server error'
            })
    }
})


router.post('/refresh', async(req, res)=> {

    const token = req.cookies.refreshToken

    if(!token) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorized! Failed to get token'
        })
    }

    try {
        
        const decoded = jwt.verify(token, process.env.REFRESH_SECRET)
        const user = await userSchema.findById(decoded.id)

        if(!user || user.refreshToken !== token) {
            return res.status(400).json({
                success: false,
                message: 'Failed! Invalid refresh token'
            })
        }

        const newAccessToken = jwt.sign(
            {id: user._id,
                userName: user?.userName,
                email: user?.email
            },
            process.env.JWT_SECRET,
            {expiresIn: '20m'}
        )

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            sameSite: 'lax'
        })

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully...'
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to refresh token'
        })
    }

})


router.get('/profile', authMiddleware ,async(req, res)=> {
    return res.json({userId: req.userId, userName: req.userName, email: req.email})
})


router.post('/logout', async(req, res)=> {
    const token = req.cookies.refreshToken

    try {
        
        if(token) {
            const user = await userSchema.findOne({refreshToken: token})

            if(user) {
                user.refreshToken = null
                await user.save()
            }
        }

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            domain: 'localhost',
            path: '/'
        })
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            domain: 'localhost',
            path: '/'
        })

        return res.status(200).json({
            success: true,
            message: 'Log out successful'
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to log out'
        })
    }
})

module.exports = router