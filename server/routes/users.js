const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const validation = require('../validation');
const bcrypt = require('bcrypt');

router.post('/login', async (req,res) => {
    const loginBody = req.body;
    try{
        console.log("Login");
        let {email,password} = loginBody;
        email = validation.checkEmail(email, 'User email');
        password = validation.checkPassword(password, 'User password');
        const user = await userData.getUserByEmail(email);
        const res = await bcrypt.compare(password, user.password);
        if(!res) throw 'Invalid Login Attempt';
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
        password = validation.checkPassword(password, 'User password');
        const newUser = await userData.addUser(email,firstName,lastName,password,uid);
        if(!newUser.userCreated){
            throw 'User already exists';
        }
        res.status(200).json(newUser.createdUser);
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
        oldPassword = validation.checkPassword(oldPassword, 'User password');
        newPassword = validation.checkPassword(newPassword, 'User password');
        let user = await userData.getUserByEmail(email);
        const res = await bcrypt.compare(oldPassword, user.password);
        if(!res) throw "Invalid password";
        user.password = bcrypt.hash(newPassword, 10);
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
    }catch(e){
        return res.status(500).json({error: e});
    }
});

module.exports = router;