
const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const schedules = data.schedules;
const users = data.users;

async function main() {
  try{
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
  
    let {createdUser} =  await users.addUser("rahul@xyz.com","Rahul","Ray","rahul@1");
   
    await schedules.addSchedule('Long Trip', createdUser._id.toString(),[],[]);
    
    
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