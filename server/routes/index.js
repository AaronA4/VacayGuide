const scheduleRoutes = require('./schedules');

const constructorMethod = (app) => {
    app.use('/schedules', scheduleRoutes);  
    
    app.use('*', (req,res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;