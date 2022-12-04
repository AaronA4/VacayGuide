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
       
        if(!Array.isArray(attendees)){
            attendees = [];
        }
        if(!Array.isArray(events)){
            events = [];
        }
        
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
    }
    
}


module.exports = exportedMethods;

