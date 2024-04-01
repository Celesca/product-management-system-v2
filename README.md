### Product Management System

Product Management System is the backend server that use to manage product.

### Installation

`git clone https://github.com/Celesca/product-management-system.git`

`cd product-management-system`

`npm start`

Then trying API endpoints with Postman or Web Browser at Port 3000.

### API Endpoints Guidelines

* `GET /products`

* `GET /products/:id`

* `POST /products`
  - Request Body : 
    {
      name,
      category,
      price,
      stock
    };

* `PUT /products/:id`
  - Request Body : 
    {
      name,
      category,
      price,
      stock
    };

* `DELETE /products/:id`

