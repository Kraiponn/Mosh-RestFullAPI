const { Customers, validate } = require('../models/customer');
const express = require('express');
const router = express.Router();
const Joi = require('joi');


// Route path
// Get all customer
router.get('/', async (req, res) => {
    try{
        const customer = await Customers.find().sort({name: 1});
        res.status(200).send(customer);
    }catch(ex){
        console.log('Error ', ex.message);
        return res.status(500).send(ex.message);
    }

    //res.status(200).send(customer);
});


// Get a customer by ID
router.get('/:id', async (req, res) => {
    try{
        const customer = await Customers.findById({id: id}).sort('name');
        res.status(200).send(customer);
    }catch(ex){
        console.log('Error ', ex.message);
        return res.status(500).send(ex.message);
    }
});

// Created new customer
router.post('/', async (req, res) => {
    try{
        const resVal = validate(req.body);
        //console.log(resVal.error);
        if(resVal.error) {
            console.log(resVal.error);
            return res.status(400).send(resVal.error.details[0].message);
        }

        const customer = new Customers({
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        });
        const result = await customer.save();

        res.status(200).send(result);
    }catch(ex){
        console.log('Error ' , ex.message);
        return res.status(400).send(ex.message);
    }
});

// Edited customer by ID
router.put('/:id', async (req, res, next) => {
    //Validate
    // If invalid, return 400 - Bad request
    const { error } = validate(req.body);

    if(error) {
        console.log(error);
        return res.status(400).send(error.details[0].message);
    }

    try{
        const id = req.params.id;
        const customer = {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        }
        //console.log(customer);
        const result = await Customers.findOneAndUpdate(
            {_id: id}, {$set: customer}
        );
        res.status(200).send(result);
    }catch(ex){
        console.log(ex.message);
        res.status(400).send(ex.message);
    }
});

// Deleted customer by ID
router.delete('/:id', async (req, res, next) => {
    try{
        const result = await Customers.findByIdAndDelete({
            id: req.params.id
        });

        res.status(200).send(result);
    }catch(ex){
        console.log(ex.message);
        res.status(400).send(ex.message);
    }
});




// Method Zone

module.exports = router;