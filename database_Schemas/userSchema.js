const mongoose = require('mongoose');
const {Schema} = mongoose;


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type:String
    },
    role: {
        type: String,
        enum: ['admin','user'],
        default: 'user'
    }
})

const model = mongoose.model('People',userSchema);

module.exports = model;