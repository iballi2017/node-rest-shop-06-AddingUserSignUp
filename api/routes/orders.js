const express = require('express');
const router = express.Router();

//USING order.js model
//Import mongoose
const mongoose = require('mongoose');
//import the order model schema here
const Order = require('../models/order');

//import the product model schema
const Product = require('../models/product');



//Handles incoming GET requests to /orders
router.get('/', (req, res, next) => {
    // res.status(200).json({
    //     message: "Orders were fetched"
    // });

    //To find and view all orders
    Order.find()
        //to select the variable info concerned
        .select('product quantity _id')  //to state which fields to select and display on the screen, without it, all fields will be displayed
        .exec()
        .then(docs => {
            // res.status(200).json(docs);
            res.status(200).json({
                cont: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            });    //return an object with addition information
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


//Handles incoming POST requests to /orders
router.post('/', (req, res, next) => {
    //To meet up the requirement to the body-parser, whenever we create a route, we should create
    //what the client is expected to have i.e create the "order"
    // const order = {
    //     productId: req.body.productId,
    //     quantity: req.body.quantity
    // };

    //To make sure product that doesn't exist in the database (i.e products we don't have) cannot be created
    //First of all, we import the product model at the top
    Product.findById(req.body.productId)
        .then(product => {
            //..............................
            //Validation
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found!'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
                .then(result => {
                    console.log(result);
                    // res.status(201).json(result)
                    res.status(201).json({
                        message: 'Order stored',
                        CreatedOrder: {
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity
                        },
                        request: {
                            type: 'GET',
                            url: 'http//localhost:3000/orders' + result.id
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
            //..............................
        })
        .catch(err => {
            res.status(500).jason({
                message: 'Product not found!',
                error: err
            })
        })

    //the code below will create new order. 
    //But for validation in order to make sure we don't order what is not available,
    //the code is transferred into the "then()" block above
    //     //...................................................
    // const order = new Order({
    //     _id: mongoose.Types.ObjectId(),
    //     quantity: req.body.quantity,
    //     product: req.body.productId
    // });
    // order.save()
    //     .then(result => {
    //         console.log(result);
    //         // res.status(201).json(result)
    //         res.status(201).json({
    //             message: 'Order stored',
    //             reatedCreated: {
    //                 _id: result._id,
    //                 product: result.product,
    //                 quantity: result.quantity
    //             },
    //             request: {
    //                 type: 'GET',
    //                 url: 'http//localhost:3000/orders' + result.id
    //             }
    //         })
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         res.status(500).json({
    //             error: err
    //         })
    //     })
    //.......................................
    // res.status(201).json({
    //     message: "Order were created",
    //     //attach the created order hear to be sent
    //     order: order
    // });
});

//Handles incoming GET requests to /orders
router.get('/:orderId', (req, res, next) => {
    // res.status(200).json({
    //     message: "Orders details",
    //     orderId: req.params.orderId
    // });
    //To call individual orders, the block of codes above have been commented out
    //follow the codes below
    Order.findById(req.params.orderId)
        .exec()
        .then(order => {
            //..................................................
            //NOTE: When trying to GET an already deleted order, the system returns 'null'
            //To get a reasonable response, the 'if statement' below is applied
            if(!order){
                res.status(404).json({
                    message: 'Order not found!'
                })
            }
            //.................................................
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });


});

//Handles incoming DELETE requests to /orders
router.delete('/:orderId', (req, res, next) => {
    // res.status(200).json({
    //     message: "Orders deleted",
    //     orderId: req.params.orderId
    // });
    Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted!',
            //a request response is sent to the user to make a new order with information ('productID' and 'quantity')
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders/',
                body: { productId: 'ID', quantity: 'Number'}
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
});


module.exports = router;