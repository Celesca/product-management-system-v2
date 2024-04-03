const request = require('supertest');
const app = require('../server');


require("dotenv").config();

// GET Method

describe('GET /products', () => {
    it("should return all products", async() => {
        const res = await request(app).get("/products");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    })
})

describe('GET /products/:id normal', () => {
    it("should return a single product", async() => {
        const res = await request(app).get("/products/660ac200b16f07a1e3b36653");
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe('660ac200b16f07a1e3b36653');
    })
})

describe('GET /products/:id with no product in products', () => {
    it("should return a 404", async() => {
        const res = await request(app).get("/products/100");
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toStrictEqual("Product not found");
    })
})

// POST /products

describe('POST /products normal', () => {
    it("should create a new product", async() => {
        const res = await request(app).post("/products").send({
            name: "C++",
            category: "Books",
            price: 350,
            stock: 1
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toStrictEqual("C++");
        expect(res.body.category).toStrictEqual("Books");
        expect(res.body.price).toBe(350);
        expect(res.body.stock).toBe(1);
    })
})

describe('POST /products Invalid Request', () => {
    it("should return a 400", async() => {
        const res = await request(app).post("/products").send({
            name: "New Product",
            category: "New Category",
            price: 100
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Invalid request body");
    })
});

describe('POST /products String Stock', () => {
    it("should return a 400", async() => {
        const res = await request(app).post("/products").send({
            name: "New Product",
            category: "New Category",
            price: 100,
            stock: "hello"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Invalid request body");
    })
});

describe('POST /products Minus price', () => {
    it("should return a 400", async() => {
        const res = await request(app).post("/products").send({
            name: "New Product",
            category: "New Category",
            price: -100,
            stock: 10
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Price and Stock must be greater than 0");
    })
});

describe('POST /products Minus stock', () => {
    it("should return a 400", async() => {
        const res = await request(app).post("/products").send({
            name: "New Product",
            category: "New Category",
            price: 100,
            stock: -10
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual("Price and Stock must be greater than 0");
    })
});

// // PUT /products/:id

// describe('PUT /products/:id normal', () => {
//     it("should update a product", async() => {
//         const res = await request(app).put("/products/1").send({
//             name: "Updated Product",
//             category: "Updated Category",
//             price: 200,
//             stock: 20
//         });
//         const updatedProduct = {
//             id: 1,
//             name: "Updated Product",
//             category: "Updated Category",
//             price: 200,
//             stock: 20
//         };
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toStrictEqual(updatedProduct);
//     })
// });

// describe('PUT /products/:id with no id in products', () => {
//     it("should return a 404", async() => {
//         const res = await request(app).put("/products/100").send({
//             name: "Updated Product",
//             category: "Updated Category",
//             price: 200,
//             stock: 20
//         });
//         expect(res.statusCode).toBe(404);
//         expect(res.body.message).toStrictEqual("Product not found");
//     })
// })

// describe('PUT /products/:id with invalid id', () => {
//     it("should return a 400", async() => {
//         const res = await request(app).put("/products/-1").send({
//             name: "Updated Product",
//             category: "Updated Category",
//             price: 200,
//             stock: 20
//         });
//         expect(res.statusCode).toBe(400);
//         expect(res.body.message).toStrictEqual("Invalid ID");
//     })
// })

// describe('PUT /products/:id Invalid Request', () => {
//     it("should return a 400", async() => {
//         const res = await request(app).put("/products/3").send({
//             name: "Updated Product",
//             category: "Updated Category",
//             price: 200
//         });
//         expect(res.statusCode).toBe(400);
//         expect(res.body.message).toStrictEqual("Invalid request body");
//     })
// });

// describe('PUT /products/:id string stock', () => {
//     it("should return a 400", async() => {
//         const res = await request(app).put("/products/3").send({
//             name: "Updated Product",
//             category: "Updated Category",
//             price: 200,
//             stock: "hello"
//         });
//         expect(res.statusCode).toBe(400);
//         expect(res.body.message).toStrictEqual("Invalid request body");
//     })
// });

// describe('PUT /products/:id Minus stock', () => {
//     it("should return a 400", async() => {
//         const res = await request(app).put("/products/1").send({
//             name: "Updated Product",
//             category: "Updated Category",
//             price: 200,
//             stock: -20
//         });
//         expect(res.statusCode).toBe(400);
//         expect(res.body.message).toStrictEqual("Price and Stock must be greater than 0");
//     })
// });

// // DELETE /products/:id
// describe('DELETE /products/:id normal', () => {
//     it("should return a 200 and deleted product", async() => {
//         const res = (await request(app).delete("/products/1"));
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toStrictEqual({message: "Product deleted"});
//     })
// })

// describe('DELETE /products/:id with not found id', () => {
//     it("should return a 404", async() => {
//         const res = await request(app).delete("/products/25");
//         expect(res.statusCode).toBe(404);
//         expect(res.body.message).toStrictEqual("Product not found");
//     })
// })

// describe('DELETE /products/:id with invalid id', () => {
//     it("should return a 400", async() => {
//         const res = await request(app).delete("/products/-1");
//         expect(res.statusCode).toBe(400);
//         expect(res.body.message).toStrictEqual("Invalid ID");
//     })
// });

// describe('DELETE /products/:id with string id', () => {
//     it("should return a 400", async() => {
//         const res = await request(app).delete("/products/hello");
//         expect(res.statusCode).toBe(400);
//         expect(res.body.message).toStrictEqual("Invalid ID");
//     })
// })