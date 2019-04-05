const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    }
});


userSchema.methods.generateAuthToken = function(){
    //console.log('id na ', this._id);
    const token = jwt.sign(
            { _id: this._id, isAdmin: this.isAdmin }, 
            config.get('jwtPrivateKey')
        );
    return token;
}

const User = mongoose.model('User', userSchema);
function validateUser(user){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean().required()
    }

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;