const express = require('express');
const router = express.Router();
const mongoCollections = require('../config/mongoCollections');
const data = require('../data');
const userData = data.users;
const validation = require('../validation');

router.post('/login', async (req,res) => {
    const loginBody = req.body;
    try{
        console.log("Login");
        let {email,password} = loginBody;
        email = validation.checkEmail(email, 'User email');
        password = validation.checkString(password, 'User password');
        const user = await userData.getUserByEmail(email);
        req.session.user = user;
        console.log("Login user: " + req.session.user.email);
        console.log(req.session.user);
        res.status(200).json(user);
    }catch(e){
        return res.status(500).json({error: e});
    }
});

router.post('/signup', async (req,res) => {
    const userBody = req.body;
    try{
        console.log("Signup");
        let {email,firstName,lastName,password,uid} = userBody;
        email = validation.checkEmail(email, 'User email');
        firstName = validation.checkString(firstName, 'User first name');
        lastName = validation.checkString(lastName, 'User last name');
        password = validation.checkString(password, 'User password');
        const newUser = await userData.addUser(email,firstName,lastName,password,uid);
        req.session.user = newUser.createdUser;
        console.log("Sign up user: " + req.session.user.email);
        res.status(200).json(newUser);
    }catch(e){
        console.log(e);
        return res.status(500).json({error: e});
    }
});

router.post('/changeUserPW', async (req,res) => {
    const userBody = req.body;
    try{
        console.log("Update User");
        let {email, oldPassword,newPassword} = userBody;
        email = validation.checkEmail(email, 'User email');
        password = validation.checkString(password, 'User password');
        let user = await userData.getUserByEmail(email);
        if(oldPassword !== user.password) res.status(400).json("Incorrect current password");
        user.password = newPassword;
        user = userData.updateUser(user._id,user);
        res.status(200).json(user);
    }catch(e){
        console.log(e);
        return res.status(500).json({error: e});
    }
});

router.get('/logout', async (req,res) => {
    try {
        console.log("Log out user: " + req.session.user.email);
        req.session.destroy();
        res.redirect('/login');
    }catch(e){
        return res.status(500).json({error: e});
    }
});

module.exports = router;