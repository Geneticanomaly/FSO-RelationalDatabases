const Blog = require('./blog');
const User = require('./user');
const ReadingList = require('./readingList');
const ActiveSession = require('./activeSession');

User.hasMany(Blog);
Blog.belongsTo(User);

User.hasMany(ActiveSession);
ActiveSession.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' });
Blog.belongsToMany(User, { through: ReadingList, as: 'usersReading' });

module.exports = {
    Blog,
    User,
    ReadingList,
    ActiveSession,
};
