const jwt = require('jsonwebtoken')

const auth = (req, res, next)=>{
    const token = req.header('Authorization')?.replace('Bearer ', '')

if(!token){
    return res.status(401).json({success: false, data: "Unauthorized" })
}
try{
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = decode
    next()
}
catch(err){
    res.status(401).json({success: false, data: err.message})
}
}

module.exports = auth