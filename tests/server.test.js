const request = require('supertest');
const app = require('../server');
const { connect, closeDatabase, clearDatabase, insertData  } = require('./mockdb');

require("dotenv").config();


const products = [
    { _id: 1, name: 'Laptop', category: 'Electronics', price: 1000, stock: 5 },
    { _id: 2, name: 'Typescript Fundamental', category: 'Books', price: 150, stock: 2 },
    { _id: 3, name: 'Clean code', category: 'Books', price: 1500, stock: 1 }
];

describe('Test request with mongoose', () => {

    beforeEach(async () => {
        await insertData(products);
    });

    beforeAll(async () => {
        await connect();
        await clearDatabase();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    // GET /products
    test("GET /products should return all products", async() => {
        const res = await request(app).get("/products");
        expect(res.statusCode).toBe(200);
    });

    test("GET /product/:id should return a single product", async() => {
        const res = await request(app).get("/products/1");
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(1);
    })

    test("GET /product/:id with no product in database should return a 404", async() => {
        const res = await request(app).get("/products/100");
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toStrictEqual("Product not found");
    })

    it("GET /products/:id with invalid id should return a 400", async() => {
        const res = await request(app).get("/products/-1");
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Product ID must be greater than 0");
    })

    it("GET /products/:id with string id should return a 400", async() => {
        const res =await request(app).get("/products/helloAA1");
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Invalid Product ID");
    })

    // POST /products
    it("POST /product normal should create a new product", async() => {
        const res = await request(app).post("/products").send({
            name: "C++",
            category: "Books",
            price: 350,
            stock: 1
        });
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(4);
        expect(res.body.name).toStrictEqual("C++");
        expect(res.body.category).toStrictEqual("Books");
        expect(res.body.price).toBe(350);
        expect(res.body.stock).toBe(1);
    })

    it("POST /products Invalid Request should return a 400", async() => {
        const res = await request(app).post("/products").send({
            name: "New Product",
            category: "New Category",
            price: 100
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Invalid request body");
    })

    it("POST /products String Stock should return a 400", async() => {
        const res = await request(app).post("/products").send({
            name: "New Product",
            category: "New Category",
            price: 100,
            stock: "hello"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Invalid request body");
    })

    it("POST /products Minus price should return a 400", async() => {
        const res = await request(app).post("/products").send({
            name: "New Product",
            category: "New Category",
            price: -100,
            stock: 10
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Price and Stock must be greater than 0");
    })

    it("POST /products Minus stock should return a 400", async() => {
        const res = await request(app).post("/products").send({
            name: "New Product",
            category: "New Category",
            price: 100,
            stock: -10
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Price and Stock must be greater than 0");
    })

    // PUT /products/:id
    it("PUT /products/:id normal should update a product", async() => {
        const res = await request(app).put("/products/1").send({
            name: "Updated Product",
            category: "Updated Category",
            price: 200,
            stock: 20
        });
        const updatedProduct = {
            _id: 1,
            name: "Updated Product",
            category: "Updated Category",
            price: 200,
            stock: 20
        };
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual(updatedProduct);
    })

    it("PUT /products/:id with no id in products should return a 404", async() => {
        const res = await request(app).put("/products/100").send({
            name: "Updated Product",
            category: "Updated Category",
            price: 200,
            stock: 20
        });
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toStrictEqual("Product not found");
    })

    it("PUT /products/:id with invalid id should return a 400", async() => {
        const res = await request(app).put("/products/-1").send({
            name: "Updated Product",
            category: "Updated Category",
            price: 200,
            stock: 20
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Invalid Product ID");
    })

    it("PUT /products/:id Invalid Request should return a 400", async() => {
        const res = await request(app).put("/products/1").send({
            name: "Updated Product",
            category: "Updated Category",
            price: 200
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Invalid request body");
    })

    it("PUT /products/:id string stock should return a 400", async() => {
        const res = await request(app).put("/products/1").send({
            name: "Updated Product",
            category: "Updated Category",
            price: 200,
            stock: "hello"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Invalid request body");
    })

    it("PUT /products/:id Minus stock should return a 400", async() => {
        const res = await request(app).put("/products/1").send({
            name: "Updated Product",
            category: "Updated Category",
            price: 200,
            stock: -20
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Price and Stock must be greater than 0");
    })
    // DELETE /products/:id
    it("DELETE /products/:id normal should return a 200 and deleted product", async() => {
        const res = (await request(app).delete("/products/1"));
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({message: "Product deleted"});
    })

    it("DELETE /products/:id with not found id should return a 404", async() => {
        const res = await request(app).delete("/products/25");
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toStrictEqual("Product not found");
    })

    it("DELETE /products/:id with invalid id should return a 400", async() => {
        const res = await request(app).delete("/products/-1");
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Invalid Product ID");
    })

    it("DELETE /products/:id with string id should return a 400", async() => {
        const res = await request(app).delete("/products/hello");
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Invalid Product ID");
    })

});