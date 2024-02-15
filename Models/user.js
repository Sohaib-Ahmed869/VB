const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: { type: String, required: true, unique: true },
    lastname: String,
    email:{ type: String, required: true, unique: true },
    password: String,
    dateOfBirth: Date,
    verified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
