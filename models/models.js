const sequelize = require('../db')
const {DataTypes} = require('sequelize')


//таблица пользователей
const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

//таблица корзины 
const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

//таблица товаров в корзине
const BasketProduct = sequelize.define('basket_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    count: {type: DataTypes.INTEGER},
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    }
});


//таблица товаров
const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER},
    img: {type: DataTypes.STRING, allowNull: false},
    count: {type: DataTypes.INTEGER, allowNull: false},
})

//таблица типов товаров
const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

//таблица описания товаров
const ProductInfo = sequelize.define('product_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false}
})


//связи таблиц

//пользователь и корзина
User.hasOne(Basket)
Basket.belongsTo(User)

//Корзины и товары в корзине
Basket.hasMany(BasketProduct)
BasketProduct.belongsTo(Basket)

//продукты в корзине
Product.hasMany(BasketProduct)
BasketProduct.belongsTo(Product)

//Типы продуктов
Type.hasMany(Product)
Product.belongsTo(Type)

//продукты и описания
Product.hasMany(ProductInfo, {as: 'info'})
ProductInfo.belongsTo(Product)


module.exports = {
    User,
    Basket,
    BasketProduct,
    Product,
    Type,
    ProductInfo,
}
