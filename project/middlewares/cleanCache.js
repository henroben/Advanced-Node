const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
    // forces this middleware to wait for the next middleware / function to complete before running
    // This way we can have middleware run AFTER the request handler has finished.
    await next();

    clearHash(req.user.id);
};