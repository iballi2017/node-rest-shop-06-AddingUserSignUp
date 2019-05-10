//To define how the user should look like in the application

//Import mongoose
const mongoose = require('mongoose');

//create the schema
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, 
        required: true, 
        unique: true,//"Unique" doesn't mean that the email will be perculiar only to a user
        //it only does field optimization. It won't even validate the email field values
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/},  
        //"match" does the validation
    password: { type: String, required: true}
});

//export the schema
module.exports = mongoose.model('User', userSchema); //this will be imported in the routing folder i.e routes/products.js