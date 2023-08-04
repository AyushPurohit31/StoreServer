const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUSer, getProfile, logoutUser } = require('../Controllers/authControllers');

//middleware
router.use(
    cors({
        credentials : true,
        origin : 'https://storemate.netlify.app/'
    })
) 

router.get('/',test);
router.post('/register', registerUser);
router.post('/logout', logoutUser);
router.post('/login', loginUSer);
router.get('/profile', getProfile);
module.exports = router;
