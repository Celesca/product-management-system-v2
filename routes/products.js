const express = require('express');
const router = express.Router();
const Product = require('../models/product');

let productID = Product.length + 1;

function ProductRequestBody(req) {

    const newProductPrice = parseFloat(req.price);
    const newProductStock = parseInt(req.stock);
  
    if (!req.name || !req.category || !newProductPrice || !newProductStock) {
      throw new Error('Invalid request body');
    }
    if (newProductPrice <= 0 || newProductStock <= 0) {
      throw new Error('Price and Stock must be greater than 0');
    }
    return {
        _id: productID++,
        name: req.name,
        category: req.category,
        price: newProductPrice,
        stock: newProductStock
    };
  }

// Get all products
router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).send({message: 'Server Error'});
    }
});

  
// Get Single Product
router.get('/:id', async (req, res) => {
    const findProductID = parseFloat(req.params.id);
    if (!findProductID || findProductID % 1 !== 0) {
        return res.status(400).send({message: 'Invalid Product ID'});
    }
    if (findProductID <= 0) {
        return res.status(400).send({message :'Price and Stock must be greater than 0'});
    }
    
    try {
      const product = await Product.findById(findProductID);
      res.json(product);
    } catch (err) {
      return res.status(404).send({message: 'Product not found'});
    }
  
})

// POST request
router.post('/', async (req, res) => {
    try {
      const newProductData = ProductRequestBody(req.body);
      const newProduct = await Product.create(newProductData);
      res.json(newProduct);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).send({message: err.message});
      }
      res.status(500).send({message: 'Server Error'});
    }
})

// PUT request
router.put('/:id', (req, res) => {
    const updateProduct = ProductRequestBody(req.body, res);
    Product.updateOne({_id: req.params.id,}, updateProduct, (err) => {
      if (err) {
        res.status(500).send({message: 'Server Error'});
      }
      else {
        res.status(200).send({message: 'Product updated'})
      }
    })
  });

// DELETE request
router.delete('/:id', (req, res) => {
    const deletedProductID = parseInt(req.params.id);
    const productIndex = ValidateProductID(deletedProductID, res);
    products.splice(productIndex, 1);
    res.send({message: 'Product deleted'});
  })

module.exports = router;