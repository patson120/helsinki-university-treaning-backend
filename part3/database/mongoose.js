require("dotenv").config();

const mongoose = require('mongoose');


const url = process.env.MONGODB_URI;

const personSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url)
    .then(() => {
        console.log('connected')
        const person = new Person({
            content: 'HTML is Easy',
            date: new Date(),
            important: true,
        })
        // return person.save()
        return Person.find({})
    })
    .then((persons) => {
        // console.log('person saved!');
        console.log('====================================');
        console.log(persons);
        console.log('====================================');
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))