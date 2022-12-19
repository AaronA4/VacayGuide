
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

    // await schedules.addSchedule('Long Trip', user1.createdUser._id.toString(),[],[]);

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