const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'Firstname must be at least 3 characters long']
        },
        lastname: {
            type: String,
            required: function() { return !this.isGoogleUser; }, // Not required if it's a Google user
            minlength: [3, 'Lastname must be at least 3 characters long']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    phone: {
        type: String,
        required: function() { return !this.isGoogleUser; }, // Not required if it's a Google user
        minlength: [10, 'Phone number must be at least 10 characters long'],
    },
    password: {
        type: String,
        required: function() { return !this.isGoogleUser; }, // Not required if it's a Google user
        select: false,
    },
    profileImage: {
      type: String,
    },
    isGoogleUser: {
        type: Boolean,
        default: false,
    },
    socketId: {
        type: String,
    },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

userSchema.methods.comparePassword = async function (Password) {
    return await bcrypt.compare(Password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;