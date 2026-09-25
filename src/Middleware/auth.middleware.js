const jwt = require('jsonwebtoken')

async function Authuser(req,res,next) {
    const token = req.cookies.token

    if(!token){
        return res.status(403).json({message:"unauthorized!"})
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).json({message:"Unauthorized!"})
    }
}
module.exports = {Authuser}