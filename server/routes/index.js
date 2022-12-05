const scheduleRoutes = require('./schedules');
const inviteRoutes = require('./invites');

const constructorMethod = (app) => {
    app.use('/schedules', scheduleRoutes);  
    app.use('/invites', inviteRoutes);
    app.use('*', (req,res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;