const ApiError = require('../error/apiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')
const sequelize = require('sequelize')

const generateJWT = (id, email, role) => {
    return jwt.sign(
        {id, email, role}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class userController {
    async registration(req, res, next) {
        const {email, password, role} = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest('Неверный логин или пароль'));
        }

        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже есть'));
        }

        try {
            const result = await sequelize.transaction(async (t) => {
                const hashPassword = await bcrypt.hash(password, 5);
                const user = await User.create({ email, role, password: hashPassword }, { transaction: t });
                await Basket.create({ userId: user.id }, { transaction: t });
                return user;
            });

            const token = generateJWT(result.id, result.email, result.role);
            return res.json({ token });
        } catch (error) {
            return next(ApiError.internal('Ошибка при регистрации: ' + error.message));
        }
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if(!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = await bcrypt.compare(password, user.password)
        if(!comparePassword) {
            return next(ApiError.internal('Неверный логин или пароль'))
        }
        const token = generateJWT(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res, next) {
        try {
            const token = generateJWT(req.user.id, req.user.email, req.user.role);
            return res.json({token});
        } catch (error) {
            return next(ApiError.internal('Ошибка при проверке токена: ' + error.message));
        }
    }
}

module.exports = new userController()