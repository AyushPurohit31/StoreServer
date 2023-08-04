const express = require('express');
const router = express.Router();
const cors = require('cors');
const { getItems, addItems, editItem, deleteItem, addBill, getBills, updateStatus } = require('../Controllers/storeControllers');

//middleware
router.use(
    cors({
        credentials : true,
        origin : 'http://localhost:5173'
    })
) 

router.get('/items/:userId',getItems);
router.get('/bills/:userId',getBills);
router.post('/addItems', addItems)
router.put('/editItem/:userId', editItem)
router.post('/deleteItem/:userId', deleteItem)
router.post('/addBill', addBill)
router.post('/updateStatus', updateStatus);

module.exports = router;