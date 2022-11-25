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
 
};

module.exports = exportedMethods;


