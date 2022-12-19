
const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const schedules = data.schedules;
const users = data.users;
const invites = data.invites;

const firebase = require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyDgAUdZscLzqaQp6KkvlaidA1HfLA1750E",
    authDomain: "vacayfall22.firebaseapp.com",
    projectId: "vacayfall22",
    storageBucket: "vacayfall22.appspot.com",
    messagingSenderId: "43591241241",
    appId: "1:43591241241:web:ad956bfef791758acfa488"
};

firebase.initializeApp(firebaseConfig);

async function main() {
  try{
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();


    let schedule1 = await schedules.addSchedule('Long Trip', user1.createdUser._id.toString(),[],[]);
    let now = new Date()
    let start = new Date(now.getTime() + 3600000)
    let end = new Date(now.getTime() + 7200000)
    let nextMonthStart = new Date(1674044090000);
    let nextMonthEnd = new Date(1674047690000)

    let user1 = {email: "rahul@xyz.com",firstName: "Rahul",lastName: "Ray",password: "rahul@1"}
    let user2 = {email: "sam@xyz.com",firstName: "Sam",lastName: "Ray",password: "same@1"}

    // User1 seed
    let user = user1;
    try{
      await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
    } catch (e) {
      if(e.code !== "auth/email-already-in-use"){
        console.log(e);
      }
    }
    await firebase.auth().signInWithEmailAndPassword(user.email,user.password);
    user1 =  await users.addUser(user.email,user.firstName,user.lastName,user.password,firebase.auth().currentUser.uid);
    await firebase.auth().signOut();
    
    //User2 seed
    user = user2;
    try{
      await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
    } catch (e) {
      if(e.code !== "auth/email-already-in-use"){
        console.log(e);
      }
    }
    await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
    user2 =  await users.addUser(user.email,user.firstName,user.lastName,user.password,firebase.auth().currentUser.uid);
    await firebase.auth().signOut();

    let event1 = await schedules.createEvent(user1.createdUser._id.toString(), schedule1._id.toString(), "Beach trip", "Trip to the beach", 0, nextMonthStart, nextMonthEnd)



    // let invite = {
    //   senderId: "638e235b97ea22d6e1b281ad",
    //   scheduleId: "638e235b97ea22d6e1b281af"

    // }

    // await users.addInvite("638e235b97ea22d6e1b281ae", invite);
    
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