const Product = require('../models/product');

async function mockData() {
    const products = [
      { id: 1, name: 'Laptop', category: 'Electronics', price: 1000, stock: 5},
      { id: 2, name: 'Typescript Fundamental', category: 'Books', price: 150, stock: 2},
      { id: 3, name: 'Clean code', category: 'Books', price: 1500, stock: 1}
    ]
    await Product.insertMany(products);
  }

module.exports = mockData;