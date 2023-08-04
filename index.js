const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');

//database connection
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("mongodb connected");
}).catch((err)=>{
    console.log("database not connected", err);
})

const app = express();
//middleware 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.use('/', require('./Routes/authRoutes'))
app.use('/store', require('./Routes/storeRoutes'))

const PORT = 8000;
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}.`);
})