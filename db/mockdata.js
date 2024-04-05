const Product = require('../models/product');

async function mockData() {
    try {
        await Product.deleteMany({});

        const products = [
            { _id: 1, name: 'Laptop', category: 'Electronics', price: 1000, stock: 5 },
            { _id: 2, name: 'Typescript Fundamental', category: 'Books', price: 150, stock: 2 },
            { _id: 3, name: 'Clean code', category: 'Books', price: 1500, stock: 1 }
        ];

        // Use bulk write operation for faster insertion
        await Product.bulkWrite(products.map(product => ({
            insertOne: {
                document: product
            }
        })));
        
        console.log('Mock data inserted successfully.');
    } catch (error) {
        console.error('Error inserting mock data:', error);
    }
}

module.exports = mockData;