const express = require('express');
const { PORT } = require('./util/config');
const blogsRouter = require('./controllers/blogs');
const { connectToDatabase } = require('./util/db');
const middleware = require('./util/middleware');

const app = express();
app.use(express.json());

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const start = async () => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

start();
