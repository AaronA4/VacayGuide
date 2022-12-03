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
    
    async updateUser(id, updatedUser){
        id = validation.checkId(id, 'id');
        updatedUser.firstName = validation.checkString(
            updatedUser.firstName,
            'First Name'
        );
        updatedUser.lastName = validation.checkString(
            updatedUser.lastName,
        )

        let userUpdateInfo = {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            password: updatedUser.password,
            schedules: updatedUser.schedules,
            invites: updatedUser.invites
            
        };
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            {_id: ObjectId(id)},
            {$set: userUpdateInfo}
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';
   
      
        
        return await this.getUserById(id);
    },

    async addInvite(userId, invite){
        if(userId === undefined) throw "User Id is not provided.";
        if(invite === undefined) throw "Invite object is not provided.";
        const userCollection = await users();

        userCollection.updateOne({_id: ObjectId(userId)},{ $addToSet: {invites: invite}});
    }
    
};

module.exports = exportedMethods;


