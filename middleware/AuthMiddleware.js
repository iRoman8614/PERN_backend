const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const tokenHeader = req.headers.authorization;
        if (!tokenHeader) {
            return res.status(401).json({message: "Пользователь не авторизован"});
        }
        const token = tokenHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({message: "Токен не найден"});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({message: "Пользователь не авторизован"});
    }
};