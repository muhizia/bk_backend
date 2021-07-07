var express = require('express');
var router = express.Router();
const multer = require('multer');
const Product = require("../models/productModel.js");

const uploadImage = multer({
    storage: multer.diskStorage(
        {
            destination: function (req, file, cb) {
                cb(null, 'public/images');
            },
            filename: function (req, file, cb) {
                cb(
                    null,
                    new Date().valueOf() + 
                    '_' +
                    file.originalname
                );
            }
        }
    ),
});
// Add category
router.post('/', uploadImage.single('image'), function(req, res) {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            message: "Product can not be empty!"
        });
    }
    const { filename, mimetype, size } = req.file;
    const filepath = req.file.path; // path to the file
    // Create a product
    const product = new Product({
        userID: req.body.userID,
        categoryID: req.body.categoryID,
        pName: req.body.pName,
        price: req.body.price,
        currency: req.body.currency,
        description: req.body.description,
        image: filename,
        manufactDate: req.body.manufactDate
    });

    // Save category in the database
    Product.add(product, (err, data) => {
        if (err)
            res.status(500).json({
                message: err.message || "Some error occurred while creating the customer."
            });
        else res.json(data);
    });
})
// retrieve all products
router.get('/', function(req, res) {
    Product.getAll((err, data) => {

        if (err)
            res.status(500).json({
                message: err.message || "Some error occurred while retrieving customers."
            });
        else res.json(data);
    });
})
module.exports = router;