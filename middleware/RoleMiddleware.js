const jwt = require('jsonwebtoken')

module.exports = function(role) {
    return function(res, req, next) {
        if(req.method === 'OPTIONS') {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if(!token) {
                return res.status(401).json({message: "пользователь не авторизован"})
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            console.log(decoded.role)
            if(decoded.role !== role) {
                return res.status(403).json({message: "нет доступа"})
            }
            req.user = decoded
            next()
        } catch (error) {
            res.status(401).json({message: "пользователь не авторизован"})
        }
    }
}