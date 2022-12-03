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
    }

}


module.exports = exportedMethods;

