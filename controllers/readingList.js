const readingListRouter = require('express').Router();
const { ReadingList } = require('../models');

readingListRouter.post('/', async (req, res) => {
    const addedBlog = await ReadingList.create(req.body);
    res.json(addedBlog);
});

module.exports = readingListRouter;
