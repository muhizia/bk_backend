var express = require('express');
var router = express.Router();
const User = require("../models/usersModel.js");

// Create a new User
router.post('/user', function(req, res) {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            message: "Content can not be empty!"
        });
    }
    console.log("Content not empty!");
    // Create a user
    const user = new User({
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        type: req.body.type
    });

    // Save category in the database
    User.add(user, (err, data) => {
        if (err)
            res.status(500).json({
                message: err.message || "Some error occurred while creating the customer."
            });
        else res.json(data);
    });
})

// retrieve all users
router.get('/user', function(req, res) {
    User.getAll((err, data) => {

        if (err)
            res.status(500).json({
                message: err.message || "Some error occurred while retrieving customers."
            });
        else res.json(data);
    });
})

// retrieve on user
router.get('/user/:id', function(req, res) {
    User.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Customer with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Customer with id " + req.params.id
                });
            }
        } else res.send(data);
    });
})

// login a on user
router.post('/login', function(req, res) {
    User.findAuser(req.body.email, req.body.username,function(err,data){
        if(!data) return res.json({isAuth : false, message : ' Auth failed ,email not found'});
        comparepassword(data.password, req.body.password, (err,isMatch)=>{
            if(!isMatch) return res.json({ isAuth : false, message : "password doesn't match"});
            else {
                delete data.password;
                res.json(data);
            }
        });
    })
})

function comparepassword(str1, str2, result)
{
    if(str1.toUpperCase() === str2.toUpperCase())
        result(null, true)
    else result(true, null)
}
module.exports = router;