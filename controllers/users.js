const userRouter = require('express').Router();
const { User, Blog } = require('../models');
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
