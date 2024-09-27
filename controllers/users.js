const userRouter = require('express').Router();
const { User, Blog, ReadingList } = require('../models');
require('express-async-errors');

const userFinder = async (req, res, next) => {
    req.user = await User.findOne({ where: { username: req.params.username } });
    next();
};

userRouter.get('/', async (req, res) => {
    const users = await User.findAll({
        include: [
            {
                model: Blog,
            },
            {
                model: Blog,
                as: 'readings',
                through: {
                    attributes: [],
                },
            },
        ],
    });
    return res.json(users);
});

userRouter.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
        include: {
            model: Blog,
            as: 'readings',
            through: {
                as: 'readinglists',
                attributes: ['id', 'read'],
            },
        },
    });
    return res.json(user);
});

userRouter.post('/', async (req, res) => {
    const user = await User.create(req.body);
    return res.json(user);
});

userRouter.put('/:username', userFinder, async (req, res) => {
    if (req.user) {
        req.user.username = req.body.username;
        await req.user.save();
        return res.json(req.user);
    } else {
        return res.status(404).end();
    }
});

module.exports = userRouter;
