const express = require('express');
const auth = require('../middleware/auth');
const _ = require('lodash');
const { validate, Customers } = require('../models/customer');
const admin = require('../middleware/admin');


const router = express.Router();

router.get('/', auth, async (req, res, next) => {
    try{
        const user = await Customers.find();
        res.status(200).send(user);
    }catch(ex){
        console.log(ex.message);
        res.status(400).send({error: ex.message});
    }
});


router.post('/', auth, async (req, res, next) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        const customer = new Customers(
            _.pick(req.body, ['name', 'isGold', 'phone'])
        );

        const result = await customer.save(); 
        res.status(200).send(result);
    }catch(ex){
        console.log(ex.message);
        res.status(400).send({error: ex.message});
    }
});

router.delete('/:id', [auth, admin], async (req, res, next) => {
    try{
        const result = await Customers
                                .findByIdAndRemove({_id: req.params.id});
        res.status(200).send({
            message: 'Deleted customer successfully.'
        });
    }catch(ex){
        console.log('error ', ex.message);
        res.status(400).send(ex.message);
    }
});


module.exports = router;