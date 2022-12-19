
const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const schedules = data.schedules;
const users = data.users;
const invites = data.invites;

async function main() {
  try{
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
  
    let user1 =  await users.addUser("rahul@xyz.com","Rahul","Ray","rahul@1");
    let user2 = await users.addUser("sam@xyz.com","Sam","Ray","sam@1");

    let schedule1 = await schedules.addSchedule('Long Trip', user1.createdUser._id.toString(),[],[]);
    let now = new Date()
    let start = new Date(now.getTime() + 3600000)
    let end = new Date(now.getTime() + 7200000)
    let nextMonthStart = new Date(1674044090000);
    let nextMonthEnd = new Date(1674047690000)
    let event1 = await schedules.createEvent(user1.createdUser._id.toString(), schedule1._id.toString(), "Beach trip", "Trip to the beach", 0, nextMonthStart, nextMonthEnd)


    let invite = {
      senderId: user1.createdUser._id.toString(),
      scheduleId: schedule1._id.toString()

    }

    await users.addInvite(user2.createdUser._id.toString(), invite);
    
    
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