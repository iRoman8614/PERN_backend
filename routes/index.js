const Router = require('express')
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')
const productRouter = require('./productRouter')

const router = new Router()

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/product', productRouter)

module.exports = router