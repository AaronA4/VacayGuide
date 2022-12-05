const express = require('express');
const router = express.Router();
const mongoCollections = require('../config/mongoCollections');
const data = require('../data');
const userData = data.users;
const validation = require('../validation');
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

router.post('/login', async (req,res) => {
    const loginBody = req.body;
    try{
        let {email,password} = loginBody;
        email = validation.checkEmail(email, 'User email');
        password = validation.checkString(password, 'User password');
        firebase.auth().signInWithEmailAndPassword(email,password)
            .then((userCredential) => {
                email = userCredential.email;
                console.log(userCredential.email);
            })
            .catch((error) => {
                var errorMessage = error.message;
                throw errorMessage;
            });
        const user = await userData.getUserByEmail(email);
        req.session.user = user._id;
        res.status(200).json(user);
    }catch(e){
        return res.status(500).json({error: e});
    }
});

router.post('/signup', async (req,res) => {
    const userBody = req.body;
    try{
        let {email,firstName,lastName,password} = userBody;
        email = validation.checkEmail(email, 'User email');
        firstName = validation.checkString(firstName, 'User first name');
        lastName = validation.checkString(lastName, 'User last name');
        password = validation.checkString(password, 'User password');
        firebase.auth().createUserWithEmailAndPassword(email,password)
            .then((userCredential) => {
                email = userCredential.email;
            })
            .catch((error) => {
                var errorMessage = error.message;
                throw errorMessage;
            });
        const newUser = await userData.addUser(email,firstName,lastName,password);
        req.session.user = newUser._id;
        res.status(200).json(newUser);
    }catch(e){
        return res.status(500).json({error: e});
    }
});

router.get('/logout', async (req,res) => {
    try {
        firebase.auth().signOut();
        req.session.destroy();
        res.redirect('/login');
    }catch(e){
        return res.status(500).json({error: e});
    }
});

module.exports = router;