const mongoCollections = require('../config/mongoCollections');
const  schedules = mongoCollections.schedules;
const  users = mongoCollections.users;
const {ObjectId} = require('mongodb');
const validation = require('../validation');

const exportedmethods = {
    async getAllInvites(id){
        const usersData = await users();
        const parseId = ObjectId(id);
        let user = await usersData.findOne({_id: parseId});
        return user.invites;
    },

    async addSchedules(userId,scheduleId){
        
        const userData = await users();
        const scheduleData = await schedules();
        let parseId = ObjectId(userId);
        let parseId2 = ObjectId(scheduleId);

        // let updateUser = {};
        //  if(scheduleId) updateUser.scheduleId = scheduleId;

        const newUpdatedUser = await userData.updateOne(
            {_id:parseId},
            {$addToSet:{"schedules.userSchedules" : scheduleId}}
        );

        const newUpdatedSchedule = await scheduleData.updateOne(
            {_id:parseId2},
            {$addToSet:{"attendees" : userId }}
        );

        if(newUpdatedUser.modifiedCount == 0) throw 'could not update the user';
        if(newUpdatedSchedule.modifiedCount == 0) throw 'could not update the schedule';

        const updatedUser = await userData.findOne({_id: parseId});
        const updatedSchedule = await scheduleData.findOne({_id:parseId2});
        return updatedUser,updatedSchedule;
    }
}

module.exports = exportedmethods;
