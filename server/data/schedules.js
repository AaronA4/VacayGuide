const mongoCollections = require('../config/mongoCollections');
const  schedules = mongoCollections.schedules;
const {ObjectId} = require('mongodb');
const  users  = require('./users');
const validation = require('../validation');

const exportedMethods = {
    async getAllSchedules(){
        const scheduleCollection = await schedules();
        return await scheduleCollection.find({}).toArray();
    },

    async addSchedule(name,creatorId,attendees,events){
       
        creatorId = validation.checkId(creatorId,'CreatorID');
        name = validation.checkString(name, 'name');
        attendees = validation.checkAttendees(attendees);
        events = validation.checkEvents(events);
      
        const scheduleCollection = await schedules();

        const userThatPosted = await users.getUserById(creatorId);
        if(userThatPosted === undefined || userThatPosted === null) throw "User not found with the id";

        const newSchedule = {
            name: name,
            creator: creatorId,
            attendees: attendees,
            events: events,
            chat: {}
        }

        const newInsertInformation = await scheduleCollection.insertOne(newSchedule);
        const newId = newInsertInformation.insertedId;
        if(newId !== undefined){
            let {_id,email, firstName,lastName,password,schedules,invites} = userThatPosted;
            schedules.ownedSchedules.push(newId.toString());
           await  users.updateUser(_id.toString(),userThatPosted);
            
        }

        return await this.getScheduleById(newId.toString());
    },

    async getScheduleById(id){
        id = validation.checkId(id,'ID');
        const scheduleCollection = await schedules();
        const schedule = await scheduleCollection.findOne({_id: ObjectId(id)});

        if(!schedule) throw 'Schedule not found.';
        return schedule;
    },

    async updateSchedule(id, updatedSchedule) {
        id = validation.checkId(id, 'id');
        updatedSchedule.name = validation.checkString(
            updatedSchedule.name,
            'Schedule Name'
        );
        updatedSchedule.creatorId = validation.checkId(
            updatedSchedule.creatorId, 
            'Creator ID'
        );

        let scheduleUpdateInfo = {
            name: updatedSchedule.name,
            creator: updatedSchedule.creatorId,
            attendees: updatedSchedule.attendees,
            events: updatedSchedule.events,
            chat: updatedSchedule.chat
        };

        const scheduleCollection = await schedules();
        const updateInfo = await scheduleCollection.updateOne(
            {_id: ObjectId(id)},
            {$set: scheduleUpdateInfo}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed.';

        return await this.getScheduleById(id);
    },

    async createEvent(userID, scheduleID, name, description, cost, startTime, endTime){
        userID = validation.checkId(userID, "User ID");
        scheduleID = validation.checkId(scheduleID, "Schedule ID");
        name = validation.checkString(name, "Event Name");
        description = validation.checkString(name, "Event Description");
        cost = validation.checkCost(cost, "Cost");
        startTime = validation.checkDate(startTime, "Start Time");
        endTime = validation.checkDate(startTime, "End Time");
        if (endTime < startTime) throw `Error: End time must come after start time!`;

        const scheduleCollection = await schedules();

        const schedule = await this.getScheduleById(scheduleID);
        if(schedule === undefined || schedule === null) throw "Schedule not found with the id";

        const userThatPosted = await users.getUserById(userID);
        if(userThatPosted === undefined || userThatPosted === null) throw "User not found with the id";
        if(schedule.creator != userID) throw `User is not the creator of the schedule!`;

        const newEvent = {
            name: name,
            description: description,
            cost: cost,
            startTime: startTime,
            endTime: endTime,
            attendees: []
        }

        const updateInfo = await scheduleCollection.updateOne(
            {_id: ObjectId(scheduleID)},
            {$push: {events: newEvent}}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

        return this.getScheduleById(scheduleID);
    },

    async updateEvent (userID, scheduleID, eventID, name, description, cost, startTime, endTime) {
        userID = validation.checkId(userID, "User ID");
        scheduleID = validation.checkId(scheduleID, "Schedule ID");
        eventID = validation.checkId(eventID, "Event ID");

        const scheduleCollection = await schedules();

        const schedule = await this.getScheduleById(scheduleID);
        if(schedule === undefined || schedule === null) throw "Schedule not found with the id";

        const userThatPosted = await users.getUserById(userID);
        if(userThatPosted === undefined || userThatPosted === null) throw "User not found with the id";
        if(schedule.creator != userID) throw `User is not the creator of the schedule!`;

        const oldEvent = await scheduleCollection.findOne({_id: ObjectId(scheduleID), "events._id": ObjectId(eventID)});

        if (name) {
            name = validation.checkString(name, "Event Name");
        }else {
            name = oldEvent.name;
        }
        if (description) {
            description = validation.checkString(name, "Event Description");
        }else {
            description = oldEvent.description;
        }
        if(cost) {
            cost = validation.checkCost(cost, "Cost");
        }else {
            cost = oldEvent.cost;
        }
        if(startTime) {
            startTime = validation.checkDate(startTime, "Start Time");
        }else {
            startTime = oldEvent.startTime;
        }
        if(endTime) {
            endTime = validation.checkDate(startTime, "End Time");
        }else {
            endTime = oldEvent.endTime;
        }
        if (endTime < startTime) throw `Error: End time must come after start time!`;

        const updatedEvent = {
            name: name,
            description: description,
            cost: cost,
            startTime: startTime,
            endTime: endTime,
        }

        const updateInfo = await scheduleCollection.updateOne(
            {_id: ObjectId(scheduleID), "events._id": ObjectId(eventID)},
            {$set: updatedEvent}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

        return this.getScheduleById(scheduleID);
    },
}




module.exports = exportedMethods;

