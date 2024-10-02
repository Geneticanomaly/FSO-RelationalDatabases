const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');
const { User, ActiveSession } = require('../models');

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.message });
    } else if (error.name === 'SequelizeDatabaseError') {
        return res.status(400).json({ error: error.message });
    } else if (error.name === 'SyntaxError') {
        return res.status(400).json({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({ error: error.message });
    } else if (error.name === 'TokenExpiredError') {
        return res.status(400).json({ error: 'token expired' });
    }
    next(error);
};

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '');
    } else {
        req.token = null;
    }
    next();
};

const userExtractor = async (req, res, next) => {
    const decodedToken = jwt.verify(req.token, SECRET);
    if (!decodedToken) return res.status(401).json({ error: 'token invalid' });

    const activeSession = await ActiveSession.findOne({
        where: {
            userId: decodedToken.id,
            token: req.token,
        },
    });

    if (!activeSession) {
        return res.status(401).json({ error: 'token not active or session has expired' });
    }

    const user = await User.findOne({
        where: {
            username: decodedToken.username,
        },
    });
    if (!user) return res.status(401).json({ error: 'user not found' });

    if (user.disabled) return res.status(403).json({ error: 'account disabled' });

    req.user = user;
    next();
};

module.exports = {
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
};
