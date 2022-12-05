const mongoCollections = require('../config/mongoCollections');
const  users = mongoCollections.users;
const bcrypt = require('bcrypt');
const {ObjectId} = require('mongodb');
const schedules  = require('./schedules');
const validation = require('../validation');

const exportedMethods = {
    async getAllUsers(){
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        if(!userList) throw "No user in system!";
        return userList;
    },

    async getUserById(id){
        id = validation.checkId(id, 'ID');
        const userCollection = await users();
        const user = await userCollection.findOne({_id: ObjectId(id)});
        if (!user) throw 'User not found';
        return user;
    },

    async getUserByEmail(email){
        id = validation.checkString(email, 'Email');
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (!user) throw 'User not found';
        return user;
    },

    async addUser(email,firstName,lastName,password){
    
       const hash = await bcrypt.hash(password, 10);
       const userCollection = await users();
       const newUser = {
            email : email,
            firstName: firstName,
            lastName: lastName,
            password: hash,
            schedules: {
                ownedSchedules: [],
                userSchedules: []
            },
            invites: []
       }
       const insertInfo  = await userCollection.insertOne((newUser));
       if(insertInfo.insertedCount === 0) throw "Unable to add user";

       return {userCreated: true, createdUser: newUser};
     
      
    },
    
    async updateUser(id, userObj){
        let {_id, firstName, lastName, password, schedules, invites} = userObj;
        id = validation.checkId(id, "id");
        firstName = validation.checkString(firstName, "First Name");
        lastName = validation.checkString(lastName, "Last Name");
        //more validation required 

        let updatedUser = {
            firstName: firstName,
            lastName: lastName,
            password: password,
            schedules: schedules,
            invites: invites
        };
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: updatedUser }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw "Update failed";

        return await this.getUserById(id);
    },

    async addInvite(userId, invite){
        if (userId === undefined) throw "User Id is not provided.";
        if (invite === undefined) throw "Invite object is not provided.";
        if(invite.scheduleId === undefined || invite.senderId === undefined) throw "Invalid invite info";
        if(invite.senderId === userId) throw "same user cant send invite to themselves";
        
        const userCollection = await users();
        const user = await this.getUserById(userId);
        if(user === undefined) throw "User not found";
        let userSchedules = user.schedules.userSchedules;
        const scheduleId = invite.scheduleId;
        for (let i = 0; i < userSchedules.length; ++i) {
          if (userSchedules[i].toString() === scheduleId)
            throw "This invite already exists";
        }
        userSchedules.push(scheduleId);
        user.schedules.userSchedules = userSchedules;
        await this.updateUser(userId, user);
        await userCollection.updateOne(
          { _id: ObjectId(userId) },
          { $addToSet: { invites: invite } }
        );
      },

    
};

module.exports = exportedMethods;


