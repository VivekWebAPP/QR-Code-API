import mongoose from "mongoose";

const ProductModel = mongoose.Schema({
    id: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    productImage: [
        {
            type: String,
            data: String,
            require: true,
        }
    ],
    typeOfProduct: {
        type: String,
        require: true,
    },
    shippingAddress: {
        type: String,
        require: true,
    },
    pincode: {
        type: Number,
        require: true,
    },
    country: {
        type: String,
        require: true,
    },
    companyName: {
        type: String,
        require: true,
    },
    customerName: {
        type: String,
        require: true,
    },
    packageSize: {
        type: String,
        require: true,
    },
    noOfItemsInPackage: {
        type: Number,
        require: true,
    },
});

const Product = mongoose.model('QR Code API', ProductModel);

export default Product;