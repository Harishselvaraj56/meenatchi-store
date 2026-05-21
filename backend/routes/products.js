const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    cat: String,
    price: Number,
    oldPrice: Number,
    off: Number,
    rating: Number,
    reviews: Number,
    img: String,
    badge: String,
    isNew: Boolean,
    inStock: Boolean
}));

router.get('/', async(req, res) => {
    const products = await Product.find();
    const fixed = products.map(p => {
        // If image is a local file (not http), point to uploads folder
        if (p.img && !p.img.startsWith('http')) {
            p = p.toObject();
            p.img = `/uploads/${p.img}`;
        }
        return p;
    });
    res.json(fixed);
});

module.exports = router;