const mongoose = require('mongoose');
const Joi = require('joi');


const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Customers = mongoose.model('Customers', customerSchema);

function validateCustomer(customer){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean().required(),
        phone: Joi.string().min(5).max(50).required()
    }

    return Joi.validate(customer, schema);
}


exports.Customers = Customers;
exports.validate = validateCustomer;
