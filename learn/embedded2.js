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
        type: [authSchema],
        required: true
    }
});
const Course = mongoose.model('Courses', courseSchema);


// Method
async function createAuthor(auth){

    try{
        const result = await auth.save();
        console.log('Created author ', result);     
    }catch(ex){
        console.log('Invalid create author ', ex.message);
    }
}

async function createCourse(name, author){
    const course = new Course({
        name,
        author
    })
    try{
        const result = await course.save();
        console.log('Created course ', result);     
    }catch(ex){
        console.log('Invalid create course ', ex.message);
    }
}

async function addCourse(cid, auth){
    try{
        const course = await Course.findById({_id: cid});
        course.author.push(auth);
        const result = await course.save();
        console.log('Created course ', result);     
    }catch(ex){
        console.log('Invalid create course ', ex.message);
    }
}

addCourse(
    '5ca447c6d5802c0ef4902e47',
    new Author({name: 'Embedded'})
);

// createCourse('Najaroon', [
//         new Author({name: 'Nong'}),
//         new Author({name: 'Jeab'})
//     ]
// );

