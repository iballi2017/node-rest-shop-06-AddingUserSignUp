const express = require('express');
const router = express.Router();


//USING product.js model
//Import mongoose
const mongoose = require('mongoose');
//import the product model schema here
const Product = require('../models/product');

//import the multer (image uploading)
const multer = require('multer');
//.....................................................................
//alter a new constant 'uplaod' to execute multer
// const uplaod = multer({dest: 'uploads/'});  //'uploads' is a folder where multer will try to store incoming files
//.....................................................................
//A better to way to execute multer using 'multer.diskStorage()'
const storage = multer.diskStorage({
    destination: function(req, file, cb){    //cb means 'callback'
        cb(null, './uploads/');  //'uploads' is a folder where multer will try to store incoming files
    },
    filename: function(req, file, cb){
        // cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); ..............//Is either you do this
        cb(null, Date.now() + file.originalname);   //..............................................or this
    }
});
//additional filtering
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' ||file.mimetype === 'image/png'){
        //to accept file and store
        cb(null, true)
    }else{
        //to reject file and store
        cb(null, false)
    }
}

// const uplaod = multer({storage: storage});    //this will work, but no filtering
const uplaod = multer({storage: storage, limits: {   //this accepts filtering i.e 'limit to file size it accepts', additional filtering can be placed above this block like thatwe have above this block
    fileSize: 1024 * 1024 * 5       //.....means 5mb file limit
}, fileFilter: fileFilter});        //..............add the "fileFilter" property constant from above to the 



router.get('/', (req, res, next) => {
    // res.status(200).json({
    //     message: "Handling GET requests to /products"
    // });
    Product.find()
    //to select the variable info concerned
    // .select('name price _id')  //to state which fields to select and display on the screen, without it, all fields will be displayed
    .select('name price _id productImage')      //........since we've now added image property, we need to allo productImage info on display
    .exec()
    .then(docs => {
        //console.log(docs);
        //the console.log(docs) above is actually displaying all fields on the screen, so to correct that
            const response = {
                count: docs.length,
                // products: docs
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,   //.....productImage is added this time
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/'+doc._id
                        }
                    }
                })
            };


        //The commented if-else block statement can be used on when the array of products is empty, but it isn't necessary cos
        //it isn't an error if the array is empty.
        // if(docs.length >= 0){
        //     res.status(200).json(docs);
        // }else{
        //     res.status(404).json({
        //         message : "No entry found!"
        //     });
        // };


        // res.status(200).json(docs);         //old response without the counters
        res.status(200).json(response);   //this will display the new docs response, showing the counters above it
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// router.post('/', (req, res, next) => {
router.post('/', uplaod.single('productImage'), (req, res, next) => {     //adding the multer middleware "uplaod.single()"
    console.log(req.file);

    //.......................................
    //To meet up the requirement to the body-parser, whenever we create a route, we should create
    //what the client is expected to have i.e create the "product"
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // };

    //the old product above is not needed again, so it is commented out
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        //adding image property to the model
        productImage: req.file.path
    });
    //we save the product info to store it in the database
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            // message: "Handling POST requests to /products",
            message: "Created Product Successfully!",  //Better object message
            //attach the created product here to be sent
            // createdProduct: result
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                //adding image property to the model
                productImage: req.file.path,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });

})

router.get('/:productid', (req, res, next) => {
    const id = req.params.productid;
    // remove the dummy code below
    // if (id === 'special') {
    //     res.status(200).json({
    //         message: "You discovered a SPECIAL ID",
    //         id: id
    //     })
    // } else {
    //     res.status(200).json({
    //         message: "You passed an ID"
    //     })
    // }
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("From database ", doc);
            if (doc) {
                // res.status(200).json(doc);
                res.status(200).json({
                    Product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'
                    }
                });
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID"
                });
            }
            // res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ err });
        });

})

router.patch('/:productid', (req, res, next) => {
    // res.status(200).json({
    //     message: "Updated product!",
    // })
    const id = req.params.productid;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({
        _id : id
    }, {
        $set : //{
            // name : req.body.newName,
            // price : req.body.newPrice
        //}
        updateOps  // this is a dynamic process that will change anything on the body, instead of the req.body.** aproach commented out above
    })
    .exec()
    .then(result => {
        // console.log(result); 
        // res.status(200).json({result})   .............//this code outputs all information
        //To output a well structured information
        res.status(200).json({
            message: 'Product Updates!!!',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id                
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
})


router.delete('/:productid', (req, res, next) => {
    // res.status(200).json({
    //     message: "Deleted product!",
    // })
    const id = req.params.productid;
    Product.remove({
        _id : id
    })
    .exec()
    .then(result => {
        // res.status(200).json(result);
        res.status(200).json({
            message: 'Product Deleted!!!',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: { name: 'String', price: 'Number'} 
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
});

module.exports = router;