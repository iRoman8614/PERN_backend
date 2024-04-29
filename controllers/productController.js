const {Product, ProductInfo} = require('../models/models');
const ApiError = require('../error/apiError');
const uuid = require('uuid');
const path = require('path');

class productController {
    async create(req, res, next) {
        try {
            let {name, price, typeId, info, count} = req.body;
            if (!req.files || !req.files.img) {
                return next(ApiError.badRequest('Изображение не загружено'));
            }
            const img = req.files.img;
            let fileName = uuid.v4() + ".jpg";
            const filePath = path.resolve(__dirname, '..', 'static', fileName);

            await new Promise((resolve, reject) => {
                img.mv(filePath, err => {
                    if (err) reject(err);
                    resolve();
                });
            });

            const product = await Product.create({name, price, typeId, count, img: fileName});

            if (info) {
                try {
                    const parsedInfo = JSON.parse(info);
                    await Promise.all(parsedInfo.map(i =>
                        ProductInfo.create({
                            title: i.title,
                            description: i.description,
                            productId: product.id
                        })
                    ));
                } catch (jsonError) {
                    return next(ApiError.badRequest('Ошибка в формате информации о продукте'));
                }
            }

            return res.json(product);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async getAll(req, res) {
        let {typeId, limit, page} = req.query;
        page = page || 1;
        limit = limit || 10;
        let offset = page * limit - limit;
        let products;
        if (!typeId) {
            products = await Product.findAndCountAll({limit, offset});
        } else {
            products = await Product.findAndCountAll({where: {typeId}, limit, offset});
        }
        res.json(products);
    }

    async getOne(req, res) {
        const {id} = req.params;
        const product = await Product.findOne({
            where: {id},
            include: [{model: ProductInfo, as: 'info'}]
        });
        return res.json(product);
    }
}

module.exports = new productController();
