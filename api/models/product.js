//To define how the product should look like in the application

//Import mongoose
const mongoose = require('mongoose');

//create the schema
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // name: String,
    // price: Number        
    //::::the previous 'name' and 'price' are optional, so we can post a product without price/name or with String/Number which is not what we want.
    name : { type: String, required: true},
    price : { type: Number, required: true}
});

//export the schema
module.exports = mongoose.model('Product', productSchema); //this will be imported in the routing folder i.e routes/products.js