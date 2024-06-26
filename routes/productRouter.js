const Router = require('express');
const productController = require('../controllers/productController');
const checkRole = require("../middleware/RoleMiddleware");

const router = new Router();

router.post('/', checkRole('ADMIN'), productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.delete('/:id', checkRole('ADMIN'), productController.deleteOne);

module.exports = router;
