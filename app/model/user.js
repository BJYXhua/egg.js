"use strict"
module.exports = (app) => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  // mongoose.connect('mongodb://127.0.0.1:27017/db')
  const UserSchema = new Schema({
    name: { type: String },
    age: { type: Number },
    skill: { type: String },
    time: { type: Date }
    // name: String,
    // age:Number
  })
  return mongoose.model("User", UserSchema, 'users')
}