import express from 'express';
import Product from '../model/Products.js';
import { validationResult, body } from 'express-validator';
import uploadCloudinary from '../Cloudinary/cloudinary.js';
import fs from 'fs';
import multer from 'multer';

const router = express.Router();

const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const upload = "./upload";
        fs.mkdirSync(upload, { recursive: true });
        cb(null, upload);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: Storage }).array("files", 1);

router.get('/getAllProducts', async (req, res) => {
    try {
        const items = await Product.find({});
        res.status(200).send({ items });
    } catch (error) {
        console.log(error.message);
        res.status(400).send({ error: error.message });
    }
});

router.post('/addNewProduct', [
    body('id').isEmpty().isString().withMessage('enter a valid id'),
    body('name').isEmpty().isString().isLength(3).withMessage('enter a valid name'),
    body('productImage').isString().isEmpty().withMessage('enter a valid productImage'),
    body('typeOfProduct').isString().isEmpty().withMessage('enter a valid type Of Product'),
    body('shippingAddress').isString().isEmpty().withMessage('enter a valid shipping Address'),
    body('pincode').isNumeric().isEmpty().isLength(5).withMessage('enter a valid pincode'),
    body('country').isString().isEmpty().withMessage('enter a valid country'),
    body('companyName').isString().isEmpty().withMessage('enter a valid company Name'),
    body('customerName').isString().isEmpty().isLength(3).withMessage('enter a valid customer Name'),
    body('packageSize').isString().isEmpty().withMessage('enter a valid package Size'),
    body('noOfItemsInPackage').isNumeric().isEmpty().withMessage('enter a valid no of items')
], async (req, res) => {
    const error = validationResult(req);
    if (error.isEmpty()) {
        return res.status(400).send({ error });
    }
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error("Multer error:", err);
            return res.status(500).json({ error: "Error uploading files" });
        } else if (err) {
            console.error("Error:", err);
            return res.status(500).json({ error: "Unknown error" });
        }

        try {
            const files = req.files;

            if (!files || files.length == 0) {
                return res.status(400).send({ error: "Files are required" });
            }

            const imagesURL = [];

            for (let file of files) {
                const localFilePath = file.path;
                const response = await uploadCloudinary(localFilePath);
                imagesURL.push(response.secure_url);
            }

            const imageUpload = new Product({
                id: req.body.id,
                name: req.body.name,
                productImage: imagesURL,
                typeOfProduct: req.body.typeOfProduct,
                shippingAddress: req.body.shippingAddress,
                pincode: req.body.pincode,
                country: req.body.country,
                companyName: req.body.companyName,
                customerName: req.body.customerName,
                packageSize: req.body.packageSize,
                noOfItemsInPackage: req.body.noOfItemsInPackage,
            });

            await imageUpload.save();

            res.status(200).send({ imageUpload });
        } catch (error) {
            console.log(error.message);
            res.status(400).send({ error: error.message });
        }
    });
});


router.get('/ProductByID/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const item = await Product.findById(productId);
        if (!item) {
            return res.status(400).send({ error: 'product Does Not Exist' });
        }
        res.status(200).send({ item });
    } catch (error) {
        console.log(error.message);
        req.status(400).send({ error: error.message });
    }
});

export default router;