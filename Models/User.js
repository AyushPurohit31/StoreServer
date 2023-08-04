const mongoose = require('mongoose');

const { Schema } = mongoose;

const billSchema = new Schema({
  name: String,
  email:String,
  phone:String,
  amount: Number,
  date: {
    type: Date,
    default: Date.now, // This sets the default value to the current date and time
  },
  status:String
});

const storeItemSchema = new Schema({
  name: String,
  quantity: Number,
  price: Number,
});

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  bills: {
    type: Array,
    of: billSchema,
    default: [],
  },
  storeItemDetails: {
    type: Array,
    of: storeItemSchema,
    default: [],
  },
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
