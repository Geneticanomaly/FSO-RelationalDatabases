const authorRouter = require('express').Router();
const { Blog } = require('../models');
const { sequelize } = require('../util/db');

authorRouter.get('/', async (req, res) => {
    const authorsData = await Blog.findAll({
        attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
        ],
        group: 'author',
        order: [['likes', 'DESC']],
    });
    res.send(authorsData);
});

module.exports = authorRouter;
