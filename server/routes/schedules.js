const express = require('express');
const { isObject } = require('util');
const router = express.Router();
const data = require('../data');
const scheduleData = data.schedules;
const server = require('http').createServer(express);
var io = require('socket.io')(server);

router.get('/', async (req,res) => {
    try{
        const scheduleList = await scheduleData.getAllSchedules();
        res.json(scheduleList);
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.post('/', async (req,res) => {
    const scheduleBody = req.body;

    //validation
    
    try{

    }catch(e){
        return res.status(500).json({error: e});
    }

    try{
        const {name,creator,attendees,events} = scheduleBody;
        const newSchedule = await scheduleData.addSchedule();
        res.json(newSchedule);
    }catch(e){
        res.status(500).json({error: e});
    }


});

router.get('/:scheduleId/chat', async (req,res) => {
    if (!req.params.scheduleId) {
        res.status(400).json({ error: 'Schedule ID not provided.' });
    };
    // user validation req
    try {
        const schedule = await scheduleData.getScheduleById(req.params.scheduleId);
        const chat = schedule.chat;

        io.on('connection', (socket) => {
            console.log('New client connected.', socket.id);

            socket.on('user_join', ({name,room}) => {
                console.log('User '+ name +' has joined room '+ room +'.'); // State may possibly include 'group' variable for different groups going to same event.
                socket.join(room);
                socket.to(room).emit('user_join', name);
            });

            socket.on('message', ({name, message, room}) => {
                // console.log(name, message, socket.id, room);
                io.to(room).emit('message', {name, message});
            });

            socket.on('disconnect', ({name,room}) => {
                console.log('User '+ name +' has left room '+ room +'.');
                socket.to(room).emit('disconnect', name);
            });
        });

        server.listen(4000, () => {
            console.log(`Listening on *:${4000}`);
        });
    } catch (e) {
        res.status(400).json({ error: 'Failed connection.' });
    }
});

module.exports = router;