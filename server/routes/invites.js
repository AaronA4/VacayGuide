const express = require('express');
const router = express.Router();
const data = require('../data');
const invitesData = data.invites;

router.get('/:id',async(req,res)=>{
    try{
        const id = req.params.id;
        const invites = await invitesData.getAllInvites(id);
        res.status(200).json(invites);
    }catch(e){
        res.status(400).json(e);
    }
})

router.post('/',async(req,res)=>{
    try{
        const userId = req.body.userId;
        const scheduleId = req.body.scheduleId;
        const postSchedule = await invitesData.addSchedules(userId,scheduleId);
        res.status(200).json(postSchedule);
    }catch(e){
        res.status(400).json(e);
        console.log(e);
    }
})

module.exports = router