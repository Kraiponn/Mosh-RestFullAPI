const auth = require('../middleware/auth');
const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User, validate } = require('../models/user');
const admin = require('../middleware/admin');
const pwdComplex = require('joi-password-complexity');

const router = express.Router();


router.get('/me',auth, async (req, res) => {
    try{
        const result = await User
                            .findById(req.user._id)
                            .select('-password');
        res.status(200).send(result);
    }catch(ex){
        console.log(ex.message);
        res.status(400).send(ex.message);
    }
});


router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(200).send(error.details[0].message);

    try{
        const email = await User.findOne({email: req.body.email});
        if(email) return res.status(400).send('Email already registered.');

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const result = await user.save();
        //console.log(result);

        const token = await jwt.sign(
                                { _id: user._id }, 
                                config.get('jwtPrivateKey')
                            );
        res.status(200)
            .header('x-auth-token', token)
            .send(
            _.pick(result, ['name', 'email', 'password'])
        );
    }catch(ex){
        console.log(ex.message);
        res.status(400).send(ex.message);
    }
});

router.put('/', (req, res) => {
    const result = _.pick(req.body, ['name', 'email']);
    res.status(200).send(result);
});



module.exports = router;