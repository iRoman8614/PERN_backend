const ApiError = require('../error/apiError');

module.exports = function(err, req, res, next) {
    console.error(err);

    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }

    if (res.headersSent) {
        return next(err);
    }

    return res.status(500).json({ message: 'Непредвиденная ошибка', error: err.toString() });
};