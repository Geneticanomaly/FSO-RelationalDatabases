const { ActiveSession } = require('../models');
const middleware = require('../util/middleware');
require('express-async-errors');

const logoutRouter = require('express').Router();

logoutRouter.delete('/', middleware.userExtractor, async (req, res) => {
    await ActiveSession.destroy({
        where: {
            user_id: req.user.id,
        },
    });
    res.status(200).end();
});

module.exports = logoutRouter;
