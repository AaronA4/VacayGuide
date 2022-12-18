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
  if(!req.session.user) return res.status(403).json("User not logged in.");
    try{

				let userObj = req.session.user;
				let email = validation.checkEmail(userObj.email);
				const user = await userData.getUserByEmail(email);
        const scheduleList = user.schedules.ownedSchedules.concat(user.schedules.userSchedules);
				console.log()
        res.status(200).json(scheduleList);
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.post('/', async (req,res) => {

	  if(!req.session.user) return res.status(403).json("User not logged in.");
    const scheduleBody = req.body;
    try{
			if(scheduleBody === undefined) throw "Schedule can't be created because of insufficient data";

			let {name,creator,attendees,events} = scheduleBody;
			let userEmail;
			if(creator === undefined) {
				userEmail = scheduleBody.userEmail;
				const user = await userData.getUserByEmail(userEmail);
				if(user)
					creator = user._id.toString();

			}
			
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

//returns all the attendees that corresponds to this schedule id
router.get('/:scheduleId/invite/', async (req,res) => {
    try{
        let scheduleId = req.params.scheduleId;
        scheduleId = validation.checkId(scheduleId, "Schedule Id");
        const schedule = await getScheduleById(scheduleId);
        if(schedule === undefined) throw `Schedule not found with id of ${scheduleId}`;
        const attendees = schedule.attendees;
        if(attendees === undefined) attendees = [];
        return res.json(attendees);
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
        let schedule = await scheduleData.getScheduleById(scheduleId);
        if(schedule === undefined) throw `Schedule not found with id of ${scheduleId}`;

        const user = await userData.getUserById(userId);
        if(user === undefined) throw `User not found with id of ${userId}`;
        const invite = {scheduleId: scheduleId, senderId: schedule.creator};   
        
        if(schedule.creator === userId) throw "Schedule creator can't invite themselves";
        
        await userData.addInvite(userId, invite);

        await scheduleData.addAttendee(scheduleId, userId);
        
        const updatedUser = await userData.getUserById(userId);
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
        const schedule = await scheduleData.getScheduleById(req.params.scheduleId);
        const chat = schedule.chat;
        res.send(200).json(chat);
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

router.get('/:scheduleId/:eventId', async (req,res) => {
    let scheduleId;
    let eventId;
    try{
        scheduleId = validation.checkId(req.params.scheduleId, "Schedule Id");
        eventId = validation.checkId(req.params.eventId, "Event Id");
    }catch(e){
        return res.status(400).json({error: e});
    }

    try{
        const event =  await scheduleData.getEvent(scheduleId, eventId);
        res.status(200).json(event);
    }catch(e) {
        return res.status(404).json({error: e});
    }
});

router.post('/:scheduleId/createEvent', async (req, res) => {
    let scheduleId;
    let userId;
    let name;
    let description;
    let cost;
    let startTime;
    let endTime;

    try{
        userId = validation.checkId(req.body.userId, "User ID");
        scheduleId = validation.checkId(req.params.scheduleId, "Schedule ID");
        name = validation.checkString(req.body.name, "Event Name");
        description = validation.checkString(req.body.description, "Event Description");
        cost = validation.checkCost(req.body.cost, "Cost");
        startTime = validation.checkDate(req.body.startTime, "Start Time");
        endTime = validation.checkDate(req.body.endTime, "End Time");
        if (endTime < startTime) throw `Error: End time must come after start time!`;
    }catch(e) {
        return res.status(400).json({error: e});
    }

    try{
        const newEvent = await scheduleData.createEvent(userId, scheduleId, name, description, cost, startTime, endTime);
        return res.status(200).json(newEvent);
    }catch(e){
        return res.status(404).json({error: e})
    }
});

router.patch('/:scheduleId/:eventId', async (req,res) => {
    let scheduleId;
    let eventId;
    let userId;

    try{
        userId = validation.checkId(req.body.userId, "User ID");
        scheduleId = validation.checkId(req.params.scheduleId, "Schedule ID");
        eventId = validation.checkId(req.params.eventId, "Event ID");
    }catch(e) {
        return res.status(400).json({error: e});
    }

    try{
        const updatedEvent = await scheduleData.updateEvent(userId, scheduleId, eventId, req.body.name, req.body.description, req.body.cost, req.body.startTime, req.body.endTime);
        return res.status(200).json(updatedEvent);
    }catch(e){
        return res.status(404).json({error: e})
    }
});

module.exports = router;