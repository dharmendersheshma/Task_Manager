const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/test')
const taskSchema = new mongoose.Schema({
    Task: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    points: {
        type: String,
        default: "0",
    },
    owner: {
        type: String,
        required: true,
        ref: "User",
    },
    submitted: {
        type: Boolean,
        default: false,
    },
    timeleft: {
        type: String,
        default: "0",
    },
}, {
    timestamps: true,
});
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;