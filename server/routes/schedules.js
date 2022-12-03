const express = require('express');
const { isObject } = require('util');
const mongoCollections = require('../config/mongoCollections');
const router = express.Router();
const data = require('../data');
const { getScheduleById } = require('../data/schedules');
const { getUserById } = require('../data/users');
const scheduleData = data.schedules;
const userData = data.users;
const server = require('http').createServer(express);
const validation = require('../validation');
var io = require('socket.io')(server);
const schedules = mongoCollections.schedules;

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
        if(scheduleBody === undefined) throw "Schedule can't be created because of insufficient data";
       
        let {name,creator,attendees,events} = scheduleBody;
        name = validation.checkString(name, 'schedule name');
        creator = validation.checkId(creator, 'creator Id');
        attendees = validation.checkAttendees(attendees);
        events = validation.checkEvents(events);


        const newSchedule = await scheduleData.addSchedule(name,creator,attendees,events);
        res.status(200).json(newSchedule);

    }catch(e){
        return res.status(500).json({error: e});
    }

   


});

router.get('/:scheduleId', async (req,res) => {
    try{
        
        let scheduleId = validation.checkId(req.params.scheduleId, "Schedule Id");
        const scheduleCollection = await schedules();
        const schedule = await scheduleCollection.findOne({ _id: id});

        if(!schedule) throw `Could not find schedule with id of ${scheduleId}`;

        res.status(200).json(schedule);

    }catch(e){
        res.status(400).json({error: e});
    }


});


//sender Id of invite is unknnown
router.post('/:scheduleId/invite/:userId', async (req,res) => {
    
    try{
        let {scheduleId, userId} = req.params;
        scheduleId = validation.checkId(scheduleId, "Schedule Id");
        userId = validation.checkId(userId, "User Id");

        const schedule = await getScheduleById(scheduleId);
        if(schedule === undefined) throw `Schedule not found with id of ${scheduleId}`;
        const user = await getUserById(userId);
        if(user === undefined) throw `User not found with id of ${userId}`;
        const invite = {scheduleId: scheduleId, senderId: "test"};   //need to make change as sender id is unknown
        await userData.addInvite(userId, invite);
        const updatedUser = await getUserById(userId);
        return res.json(updatedUser);
    }catch(e){
        res.status(400).json({error: e});
    }

     
});


router.get('/:scheduleId/chat', async (req,res) => {
    if (!req.params.scheduleId) {
        res.status(400).json({ error: 'Schedule ID not provided.' });
    };
    // user validation req
    try {
        io.on('connection', (socket) => {
            console.log('New client connected.', socket.id);

            socket.on('user_join', ({name,event}) => {
                console.log('User '+ name +' has joined room '+ event +'.'); // State may possibly include 'group' variable for different groups going to same event.
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