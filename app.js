const express = require('express');
const app = express();

//Install a login package called "morgan" ==> npm install --save morgan
const morgan = require("morgan");

//Install a body extracting package called "body-parser" ==> npm install --save body-parser
const bodyParser = require("body-parser");

//Install a database package called "Mongoose" ==> npm istall --save mongoose
//Import mongoose here:
const mongoose = require("mongoose");


// app.use((req, res, next) => {
//     res.status(200).json({
//         message: "It works!",
//         name : "Alli",
//         Age: 20,
//     });
// });

//import product route
const productRoutes = require('./api/routes/products');
//import order route
const orderRoutes = require('./api/routes/orders');
//import user route
const userRoutes = require('./api/routes/user');


// mongoose.connect('mongodb+srv://node-shop:node-shop@iballidb-nxfdz.mongodb.net/test?retryWrites=true');  //This is a hard-coded inclusion of password
mongoose.connect('mongodb+srv://node-shop:'+ process.env.MONGO_ATLAS_PW +'@iballidb-nxfdz.mongodb.net/test?retryWrites=true'    //This is a dynamic inclusion of password, putting it into an environment variable. Check the file nodemon.json
// , {
//     useMongoClient: true
// }
//........................Above code. The `useMongoClient` option is no longer necessary in mongoose 5.x, please remove it.
);

//Apply the code below if you keep getting "plug in your Promice library..." error
// mongoose.Promise = global.Promise;

//To use morgan
app.use(morgan('dev'));

//To make sure image url is publicly available
app.use('/uploads', express.static('uploads'));


//To use body-parser
//"true" allows you to parse extended body with rich data in it. We put this bodyparser to false
//to support simple body for url-encoded data
app.use(bodyParser.urlencoded({extended: false}));
//The body-parser code below applies json as a method without argument
//This will extract json data and makes it easily readable
app.use(bodyParser.json());

//To handle CORS (CROSS-ORIGIN RESOURSE SHARING) errors
//Append headers to any response being sent back. Make sure you do this before reaching the routes below
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); //this is a header that give access to any client
    // res.header('Access-Control-Allow-Origin', 'http://alli.com');   ........this an option to give access to only clients from "http://alli.com"
    //typically in RESTFUL api, you give access to any clients
    
    //Append the second header like below to tell the type of headers it should accept
    // res.header('Access-Control-Allow-Origin', '*'); ................to accept all header
    res.header('Access-Control-Allow-Origin', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');  //to accept specific type of headers
        // ........................................................
    //To check the request before access
    if(req.method==='OPTIONS'){
        req.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE')
        return res.status(200).json({})
    }
    next();
    });




//Routes that will handle products requests
app.use('/products', productRoutes);
//Routes that will handle orders requests
app.use('/orders', orderRoutes);
//Routes that will handle user requests
app.use('/user', userRoutes);



//To handle errors
app.use((req, res, next) =>{
    const error = Error("Request not found!");
    error.status = 404;
    next(error);
})

//For other errors
app.use((error, req, res, next) =>{
    res.status(error.status || 404);
    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;