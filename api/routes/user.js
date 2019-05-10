const express = require('express');
const router = express.Router();

//USING user.js model
//Import mongoose
const mongoose = require('mongoose');
//....................................
//import bcrypt password hasher
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
//....................................

//import the user model schema here
const User = require('../models/user');

//Creating signup and login routes
//Signup routes
router.post('/signup', (req, res, next) => {

    // User.find({email: req.body.email}).exec().then(/*Ckeck if user exists here*/).catch()    .....to avoid data duplication
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1){
            return res.status(409).json({
                message: 'User already exists!!!'
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {       // "npm install bcrypt --save" to encrypt password.....check "https://www.npmjs.com/package/bcrypt" for documentation
                //if error exists in the password    
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    //if no error, create a new user
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    //if user is created, save()
                    user.save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User created!'
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            });
        }
    })
    .catch()

});

router.delete('/:userId', (req, res, next) =>{
    
    const id = req.params.userId;
    User.remove({
        _id : req.params.userId
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
})


// router.delete('/:productid', (req, res, next) =>{
    
//     const id = req.params.productid;
//     Product.remove({
//         _id : id
//     })
//     .exec().next().catch();
// })


module.exports = router;