const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {

    // console.log("Cookies:", req.cookies)

    const token = req.cookies?.accessToken

    console.log("Token",token)

    if(!token) {
        return res.status(401).json({
            message: 'Failed! No token found'
        })
    }

    try {
        console.log("JWT Secret", process.env.JWT_SECRET)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)
        req.userId = decoded.id
        req.userName = decoded.userName
        req.email = decoded.email

        next()

    } catch (error) {
        console.log('Jwt error', error.message)
        res.status(401).json({
            success: false,
            message: 'Failed! invalid token'
        })
    }
}

module.exports = authMiddleware