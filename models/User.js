const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    bio: { type: String },
});

module.exports = mongoose.model('User', userSchema);
