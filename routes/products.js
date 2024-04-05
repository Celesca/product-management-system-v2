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
        name: req.name,
        category: req.category,
        price: newProductPrice,
        stock: newProductStock
    };
  }

function ValidateProductID(findProductID) {
    if (!findProductID || findProductID % 1 !== 0) {
        throw Error ('Invalid Product ID');
    }
    if (findProductID <= 0) {
        throw Error('Product ID must be greater than 0');
    }
    return parseInt(findProductID);
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
    try {
        ValidateProductID(parseFloat(req.params.id));
    }
    catch (err) {
        return res.status(400).send({message: err.message});
    }

    try {
      const product = await Product.findById(parseInt(req.params.id));
      if (!product) {
          throw new Error('Product not found');
      }
      res.json(product);
    } catch (err) {
      return res.status(404).send({message: 'Product not found'});
    }

})

// POST request
router.post('/', async (req, res) => {
    try {
      const newProductData = ProductRequestBody(req.body);
        newProductData._id = productID++;
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
router.put('/:id', async (req, res) => {
    try {
        ValidateProductID(parseFloat(req.params.id));

    } catch {
        return res.status(400).send({message: 'Invalid Product ID'});
    }

    try {
        const product = await Product.findById(parseInt(req.params.id));
        if (!product) {
            throw new Error('Product not found');
        }
    } catch {
        return res.status(404).send({message: 'Product not found'});
    }

    try {
        const updateProduct = ProductRequestBody(req.body);
        updateProduct._id = parseInt(req.params.id);
        Product.updateOne({_id: req.params.id,}, updateProduct);
        res.json(updateProduct);
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(400).send({message: err.message});
        }
        res.status(500).send({message: 'Server Error'});
    }

  });

// DELETE request
router.delete('/:id', async(req, res) => {
    try {
        ValidateProductID(parseFloat(req.params.id));

    } catch {
        return res.status(400).send({message: 'Invalid Product ID'});
    }

    try {
        const product = await Product.findById(parseInt(req.params.id));
        if (!product) {
            throw new Error('Product not found');
        }
    } catch {
        return res.status(404).send({message: 'Product not found'});
    }

    Product.deleteOne({_id: parseInt(req.params.id)});
    res.send({message: 'Product deleted'});
  })

module.exports = router;