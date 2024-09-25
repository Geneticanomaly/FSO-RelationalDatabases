const loginRouter = require('express').Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');

loginRouter.post('/', async (req, res) => {
    const user = await User.findOne({
        where: {
            username: req.body.username,
        },
    });

    const correctPassword = req.body.password === 'secret';

    if (!(user && correctPassword)) {
        return res.status(401).json({ error: 'invalid username or password' });
    }

    const userForToken = {
        id: user.id,
        username: user.username,
    };

    const token = jwt.sign(userForToken, SECRET);

    return res.status(200).json({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
