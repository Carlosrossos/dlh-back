const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: String,
    mail: String,
    token: String,
    password : String,
    favPoi: [{type: mongoose.Schema.Types.ObjectId, ref: 'pois'}],
});

const User = mongoose.model("users", userSchema);

module.exports = User;