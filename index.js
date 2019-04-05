const express = require('express');
const path = require('path');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const mongoose = require('mongoose');
const genresRoute = require('./routes/genres');
const customerRoute = require('./routes/customer');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');

if(!config.get('jwtPrivateKey')){
    console.error('Faltal error: jwtPrivateKey is not definded.');
    process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(morgan('tiny'));

mongoose.set('useCreateIndex', true);
mongoose.connect(
        "mongodb://localhost/playground", 
        { useNewUrlParser: true }
    )
    .then(() => console.log('Connect to mongodb...'))
    .catch(err => console.log('Could not connect to MongoDB'));

if(app.get('env') === 'development'){
    console.log('Morgan is running...');
}

app.use('/api/genres', genresRoute);
app.use('/api/customers', customerRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);

app.get('/', (req, res) => {
    res.status(200).send('Welcome to NodeJS - Express web API');
})

const port = process.env.PORT || 3000;
//const server = http.createServer(app);
app.listen(port, () => {
    console.log('Server listen on port ' + port);
});