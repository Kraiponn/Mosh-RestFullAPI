const mongoose = require('mongoose');

mongoose.connect(
        "mongodb://localhost/playground",
        { useNewUrlParser: true }
    )
    .then(() => console.log('Connect to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB.. ' + err));

const authSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    web: {
        type: String,
        required: true
    }
});

const authors = mongoose.model('Authors', authSchema);

const proSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Authors'
    } 
});

const products = mongoose.model('Products', proSchema);


async function createdAuthor(){
    const authorPacket = {
        name: 'kraipon',
        bio: 'yes',
        web: 'www.ksn-development.com'
    }

    const author = new authors(authorPacket);
    try{
        const result = await author.save();
        console.log(result);
    }catch(err){
        console.log(err);
    }
}

async function createdProduct(){
    const productPacket = {
        name: 'kraipon',
        author: '5ca36db8a71b30253c26fa2f'
    }

    const product = new products(productPacket);
    try{
        const result = await product.save();
        
        console.log(result);
    }catch(err){
        console.log(err);
    }
}



async function showList(){
    try{
        const result = await products
                                .find()
                                .populate('author')
                                .select('name author');

        console.log(result);
    }catch(err){
        console.log(err);
    }
}

//createdAuthor();

//createdProduct();

showList();
