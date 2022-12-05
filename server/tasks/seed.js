
const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const schedules = data.schedules;
const users = data.users;
const invites = data.invites;

async function main() {
  try{
    const db = await dbConnection.dbConnection();
    // await db.dropDatabase();
  
    // let user1 =  await users.addUser("rahul@xyz.com","Rahul","Ray","rahul@1");
    // let user2 = await users.addUser("sam@xyz.com","Sam","Ray","sam@1");

    // await schedules.addSchedule('Long Trip', user1.createdUser._id.toString(),[],[]);

    let invite = {
      senderId: "638e235b97ea22d6e1b281ad",
      scheduleId: "638e235b97ea22d6e1b281af"

    }

    await users.addInvite("638e235b97ea22d6e1b281ae", invite);
    
    
    console.log('Done seeding database');
  
   
  }catch(e){
    console.log(e);
  }
  await dbConnection.closeConnection();
  }

  try{
  main();
  }
  catch(e){
    console.log(e);
  };