//To define how the order should look like in the application

//Import mongoose
const mongoose = require('mongoose');

//create the schema
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},   //"ref" is refrence to the exported "Product" from the product.js model
    quantity: {type: Number, default: 1}
});

//export the schema
module.exports = mongoose.model('Order', orderSchema); //this will be imported in the routing folder i.e routes/products.js