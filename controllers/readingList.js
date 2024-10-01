const readingListRouter = require('express').Router();
const { ReadingList } = require('../models');
require('express-async-errors');
const middleware = require('../util/middleware');

readingListRouter.post('/', async (req, res) => {
    const addedBlog = await ReadingList.create(req.body);
    res.json(addedBlog);
});

readingListRouter.put('/:id', middleware.userExtractor, async (req, res) => {
    await ReadingList.update(
        { read: req.body.read },
        {
            where: {
                id: req.params.id,
                user_id: req.user.id,
            },
        }
    );
    res.status(200).end();
});

module.exports = readingListRouter;
