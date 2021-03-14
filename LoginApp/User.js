var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')

var userSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    password: {type: String},
    points: {type: Number, default: 0}
})

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "email",
    foreignField: "owner",
    });

var User = mongoose.model('myusers', userSchema)
module.exports = User