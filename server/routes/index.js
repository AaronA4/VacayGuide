const scheduleRoutes = require('./schedules');
const usersRoutes = require('./users');

const constructorMethod = (app) => {
    app.use('/schedules', scheduleRoutes);  
    app.use('/', usersRoutes);
    
    app.use('*', (req,res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;