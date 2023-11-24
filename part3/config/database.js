const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

if (!process.env.MONGODB_URI) {
    console.log('Please provide the URI of your Mongo database.')
    process.exit(1)
} else {
    mongoose.connect(process.env.MONGODB_URI, {})
        .then(() => console.log("Connected to MongoDB..."))
        .catch((error) => console.error(error));
}
