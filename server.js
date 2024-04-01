const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// สร้าง Schema และ Model
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number
});
const Product = mongoose.model('Product', productSchema);

mongoose.connect
('mongodb://localhost:27017/productDB', 
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server once connected to the database
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
    .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Mock Data



// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`)
  next();
})

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send({message: 'Server Error'});
  }
});

// Get Single Product
app.get('/products/:id', async (req, res) => {
  const findProductID = parseInt(req.params.id)

  if (findProductID <= 0 || !findProductID) {
    return res.status(400).send({message: 'Invalid ID'});
  }
  
  try {
    const product = await Product.findById(findProductID);
    res.json(product);
  } catch (err) {
    return res.status(404).send({message: 'Product not found'});
  }

})

function ProductRequestBody(req, res) {

  const newProductPrice = parseFloat(req.price);
  const newProductStock = parseInt(req.stock);

  if (!req.name || !req.category || !newProductPrice || !newProductStock) {
    return res.status(400).send({message: 'Invalid request body'});
  }
  if (newProductPrice <= 0 || newProductStock <= 0) {
    return res.status(400).send({message: 'Price and Stock must be greater than 0'});
  }
  const newProduct = {
      name: req.name,
      category: req.category,
      price: newProductPrice,
      stock: newProductStock
    };

  return newProduct;
}

function ValidateProductID(productID, res) {
  if (productID <= 0 || !productID) {
    return res.status(400).send({ message: 'Invalid ID' });
  }

   const productIndex = products.findIndex(p => p.id === productID);
   if (productIndex === -1) {
    return res.status(404).send({message: 'Product not found'});
   }
   
   return productIndex;
}

// POST request
app.post('/products', async (req, res) => {
    try {
      const newProduct = await Product.create(ProductRequestBody(req.body, res));
      res.json(newProduct);
    } catch (err) {
      res.status(500).send({message: 'Server Error'});
    }
})

// PUT request
app.put('/products/:id', (req, res) => {
  const updateProductID = parseInt(req.params.id);
  const productIndex = ValidateProductID(updateProductID, res);
  const updateProduct = ProductRequestBody(req.body, res);

  const product = products[productIndex];

  product.name = updateProduct.name;
  product.category = updateProduct.category;
  product.price = updateProduct.price;
  product.stock = updateProduct.stock;
  res.json(product);
});

// DELETE request
app.delete('/products/:id', (req, res) => {
  const deletedProductID = parseInt(req.params.id);
  const productIndex = ValidateProductID(deletedProductID, res);
  products.splice(productIndex, 1);
  res.send({message: 'Product deleted'});
})

module.exports = app;