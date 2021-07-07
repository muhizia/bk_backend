var express = require('express');
var router = express.Router();
const Category = require("../models/categoryModel.js");


// Add category
router.post('/', function(req, res) {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            message: "Content can not be empty!"
        });
    }
    // Create a customer
    const category = new Category({
        categoryName: req.body.categoryName
    });

    // Save category in the database
    Category.add(category, (err, data) => {
        if (err)
            res.status(500).json({
                message: err.message || "Some error occurred while creating the customer."
            });
        else res.json(data);
    });
})

module.exports = router;