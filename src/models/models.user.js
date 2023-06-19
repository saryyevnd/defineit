const { Schema, model } = require("mongoose");

const wordSchema = new Schema({
  showTime: Number,
  word: String,
});

const schema = new Schema({
  userId: Number,
  userName: String,
  lastName: String,
  firstName: String,
  date: { type: Date, default: Date.now() },
  words: [wordSchema],
});

module.exports = model("User", schema);
