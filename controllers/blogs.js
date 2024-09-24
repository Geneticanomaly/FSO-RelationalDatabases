const blogsRouter = require('express').Router();
const { Blog } = require('../models');
require('express-async-errors');

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id);
    next();
};

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.findAll();
    res.json(blogs);
});

blogsRouter.post('/', async (req, res, next) => {
    try {
        const blog = await Blog.create(req.body);
        return res.json(blog);
    } catch (error) {
        next(error);
    }
});

blogsRouter.delete('/:id', blogFinder, async (req, res) => {
    if (req.blog) await req.blog.destroy();
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
