const blogsRouter = require('express').Router();
const { Op } = require('sequelize');
const { Blog, User } = require('../models');
require('express-async-errors');
const middleware = require('../util/middleware');

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id);
    next();
};

blogsRouter.get('/', async (req, res) => {
    const where = {};

    // [Op.iLike]: `%${req.query.search}%` - Case-insensitive
    if (req.query.search) {
        where[Op.or] = [
            {
                title: {
                    [Op.substring]: req.query.search,
                },
            },
            {
                author: {
                    [Op.substring]: req.query.search,
                },
            },
        ];
    }

    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name'],
        },
        where,
        order: [['likes', 'DESC']],
    });
    return res.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (req, res, next) => {
    const blog = await Blog.create({ ...req.body, userId: req.user.id });
    return res.json(blog);
});

blogsRouter.delete('/:id', middleware.userExtractor, blogFinder, async (req, res) => {
    if (!req.blog) return res.status(404).json({ error: 'no such blog found' });

    if (req.blog.userId !== req.user.id) {
        return res.status(403).json({ error: 'action not authorized' });
    }

    await req.blog.destroy();
    res.status(204).end();
});

blogsRouter.put('/:id', blogFinder, async (req, res, next) => {
    if (req.blog) {
        req.blog.likes = req.body.likes;
        await req.blog.save();
        res.json(req.blog);
    } else {
        res.status(404).end();
    }
});

module.exports = blogsRouter;
