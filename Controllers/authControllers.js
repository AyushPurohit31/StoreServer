const User = require('../Models/User');
const {hashPassword, comparePasswords} = require('../Helpers/auth')
const jwt = require('jsonwebtoken');

const test = (req, res)=>{
    res.json('test is working')
}

//register user controller
const registerUser = async(req, res)=>{
    try {
        const {name ,email ,password} = req.body;
        //checks if name is there
        if(!name){
            return res.json({
                error : "Name is required!"
            })
        };
        if(!email){
            return res.json({
                error : "Email is required!"
            })
        };
        //password is good or not
        if(!password || password.length < 6){
            return res.json({
                error : "Password should be atleast 6 characters long!"
            })
        };
        //check email
        const exist = await User.findOne({email});
        if(exist){
            return res.json({
                error : "Email is taken!"
            })
        }

        const hashedPassword = await hashPassword(password);
        //create user
        const user = await User.create({
            name, email, password:hashedPassword
        })

        return res.json(user)
    } catch (error) {
        console.log(error);
    }
}

//login user controller
const loginUSer = async(req, res)=>{
    try {
        const {email , password} = req.body;
        
        //check if user exits
        const user = await User.findOne({email});
        if(!user){
            return res.json({
                error: "Email not registered!"
            })
        }

        //check is password matched
        const match = await comparePasswords(password, user.password);
        if(match){
            jwt.sign({email:user.email, id: user._id, name:user.name}, process.env.JWT_SECRET, {}, (err, token)=>{
                if(err) throw err;
                res.cookie('token', token).json(user)
            })
        }else{
            res.json({
                error : "Invalid Password"
            })
        }
    } catch (error) {
        console.log(error);
    }
}

const logoutUser = (req, res)=>{
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
}

const getProfile = (req, res)=>{
    const {token} = req.cookies
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user)=>{
            if(err)throw err;
            res.json(user);
        })
    }else{
        res.json(null)
    }
}
module.exports = {
    test, registerUser, loginUSer, getProfile, logoutUser
};
