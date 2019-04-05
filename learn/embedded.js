const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/playground", {useNewUrlParser: true})
.then(() => console.log('Connect to MongoDB...'))
.catch(err => console.log('Could not connect to MongoDB'));

const authSchema = new mongoose.Schema({
    name: String,
    bio: String,
    web: String
});
const Author = mongoose.model('Authors', authSchema);

const courseSchema = new mongoose.Schema({
    name: String,
    author: {
        type: authSchema,
        required: true
    }
});
const Course = mongoose.model('Courses', courseSchema);


// Method
async function createAuthor(name, bio, web){
    const author = new Author({
        name,
        bio,
        web
    });

    try{
        const result = await author.save();
        console.log('Created author ', result);     
    }catch(ex){
        console.log('Invalid create author ', ex.message);
    }
}

async function createCourse(name, author){
    const course = new Course({
        name,
        author
    });

    try{
        const result = await course.save();
        console.log('Created course ', result);     
    }catch(ex){
        console.log('Invalid create course ', ex.message);
    }
}


async function listCourse(){
    try{
        const result = await Course.find();
        console.log(result);     
    }catch(ex){
        console.log('Invalid find a course ', ex.message);
    }
}


async function updateCourse(){
    const _id = '5ca41d1217552a2bfc373948';
    try{
        // const course = await Course.findById({_id: _id});
        // course.author.name = 'hello nodejs';
        // course.save();

        const course = await Course.update(
            {_id: _id},
            {
                $set: {
                    'author.name': 'Web API'
                }
            }
        )

        console.log(course);     
    }catch(ex){
        console.log('Invalid find a course ', ex.message);
    }
}

updateCourse();

//createAuthor('NongJeab', 'Life', 'ksn-development');
// createCourse(
//     'Full stack developer',
//     new Author({name: 'NongJeab'})
// );

//listCourse();


