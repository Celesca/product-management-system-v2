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
async function mockData() {
  const products = [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 1000, stock: 5},
    { id: 2, name: 'Typescript Fundamental', category: 'Books', price: 150, stock: 2},
    { id: 3, name: 'Clean code', category: 'Books', price: 1500, stock: 1}
  ]
  await Product.insertMany(products);
}

mockData();

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
  const findProductID = req.params.id
  
  try {
    const product = await Product.findById(findProductID);
    res.json(product);
  } catch (err) {
    return res.status(404).send({message: 'Product not found'});
  }

})

function ProductRequestBody(req) {

  const newProductPrice = parseFloat(req.price);
  const newProductStock = parseInt(req.stock);

  if (!req.name || !req.category || !newProductPrice || !newProductStock) {
    throw new Error('Invalid request body');
  }
  if (newProductPrice <= 0 || newProductStock <= 0) {
    throw new Error('Price and Stock must be greater than 0');
  }
  const newProduct = {
      name: req.name,
      category: req.category,
      price: newProductPrice,
      stock: newProductStock
    };

  return newProduct;
}

// POST request
app.post('/products', async (req, res) => {
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
app.put('/products/:id', (req, res) => {
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
app.delete('/products/:id', (req, res) => {
  const deletedProductID = parseInt(req.params.id);
  const productIndex = ValidateProductID(deletedProductID, res);
  products.splice(productIndex, 1);
  res.send({message: 'Product deleted'});
})

module.exports = app;