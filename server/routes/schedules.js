const express = require('express');
const router = express.Router();
const data = require('../data');
const scheduleData = data.schedules;


router.get('/', async (req,res) => {
    try{
        const scheduleList = await scheduleData.getAllSchedules();
        res.json(scheduleList);
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.post('/', async (req,res) => {
    const scheduleBody = req.body;

    //validation
    
    try{

    }catch(e){
        return res.status(500).json({error: e});
    }

    try{
        const {name,creator,attendees,events} = scheduleBody;
        const newSchedule = await scheduleData.addSchedule();
        res.json(newSchedule);
    }catch(e){
        res.status(500).json({error: e});
    }


});

module.exports = router;