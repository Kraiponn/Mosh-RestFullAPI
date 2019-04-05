const express = require('express');
const router = express.Router();
const Joi = require('joi');

const genres = [
    {id: 1, name: 'genres1'},
    {id: 2, name: 'genres2'},
    {id: 3, name: 'genres3'}
]


router.get('/', (req, res, next) => {
    res.status(200).send(genres);
});

router.get('/:id', (req, res, next) => {
    const genre = genres.find(c => parseInt(req.params.id) === c.id);
    if(!genre){
        return res.status(404).send('The genre with the given ID was not found')
    }

    res.status(200).send('You choose id ' + req.params.id);
});

router.post('', (req, res, next) => {
    const schema = {
        name: Joi.string().min(3).max(105).required()
    }
    const result = Joi.validate(req.body, schema);
    //console.log(result);

    if(result.error){
        //return res.status(400).send('Name is required and should be minimum 3 characters.');
        return res.status(400).send(result.error.details[0].message);
    }

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }

    genres.push(genre);
    res.status(200).send(genres);
});

router.put('/:id', (req, res, next) => {
    const genre = genres.find(c => parseInt(req.params.id) === c.id);
    if(!genre){
        return res.status(404).send('The genre with the given ID was not found')
    }

    //Validate
    // If invalid, return 400 - Bad request
    const { error } = validategenre(req.body);
    if(error){
        //return res.status(400).send('Name is required and should be minimum 3 characters.');
        return res.status(400).send(error.details[0].message);
    }

    genre.name = req.body.name;
    res.status(200).send(genre);
});

router.delete('/:id', (req, res, next) => {
    const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The genre and the given ID was not found.');

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.status(200).send(genres);
});



function validategenre(genre){
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(genre, schema);
}

module.exports = router;