const mongoose = require('mongoose');
const products = require('../seed/productData.json')
const Product = require('../models/product')


require('dotenv').config();

const seedProducts = async () => {
    try {

        const mongoURL = process.env.MONGO_URL;

        if (!mongoURL) {
            throw new Error("MONGO_URL is undefined. Check your .env file location and format.");
        }

        await mongoose.connect(mongoURL);
    
        await Product.deleteMany({});

        await Product.insertMany(products);
        process.exit();

    } catch (err) {

        process.exit(1);
    }
};

seedProducts();