const express = require('express');
const path = require('path');
const app = express();
const Joi = require('joi');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
]

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(morgan('tiny'));

console.log('Application name ' + config.get('name'));
console.log('Mail server ' + config.get('mail.host'));

if(app.get('env') === 'development'){
    console.log('Morgan is running...');
}

app.get('/', (req, res, next) => {
    res.status(200).json({
        data: "Hello API"
    })
});

app.get('/api/course', (req, res) => {
    res.status(200).send(courses);
});

app.get('/api/course/:id', (req, res) => {
    const course = courses.find(c => parseInt(req.params.id) === c.id);
    if(!course){
        return res.status(404).send('The course with the given ID was not found')
    }

    res.status(200).send('You choose id ' + req.params.id);
});

app.post('/api/course', (req, res) => {
    const schema = {
        name: Joi.string().min(3).max(105).required()
    }
    const result = Joi.validate(req.body, schema);
    //console.log(result);

    if(result.error){
        //return res.status(400).send('Name is required and should be minimum 3 characters.');
        return res.status(400).send(result.error.details[0].message);
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }

    courses.push(course);
    res.status(200).send(courses);
});

app.put('/api/course/:id', (req, res) => {
    const course = courses.find(c => parseInt(req.params.id) === c.id);
    if(!course){
        return res.status(404).send('The course with the given ID was not found')
    }

    //Validate
    // If invalid, return 400 - Bad request
    const { error } = validateCourse(req.body);
    if(error){
        //return res.status(400).send('Name is required and should be minimum 3 characters.');
        return res.status(400).send(error.details[0].message);
    }

    course.name = req.body.name;
    res.status(200).send(course);
});

app.delete('/api/course/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course and the given ID was not found.');

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.status(200).send(courses);
});



function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema);
}


const port = process.env.PORT || 3000;
//const server = http.createServer(app);
app.listen(port, () => {
    console.log('Server listen on port ' + port);
});