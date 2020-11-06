# node-shop-api

Simple RESTful API projects that recreates the core of what an online shop may use.
The API stores its data into a cloud database, encrypting sensitive data about its users.
It does its authentication using JSON tokens and limits access based on assigned roles.

## Endpoints

### GET
```
http://.../products/
```
Sends a response listing all available products from the data base.
```
http://.../products/{product_id}
```
Returns information about a product which matches the id provided.
```
http://.../orders/
```
Sends a response listing all orders from the data base. Accessible only by admins.
```
http://.../orders/{order_id}
```
Returns information about an order which matches the id provided. It can be accessed by user who made the order or admins.
```
http://.../users/
```
Returns a list of all users. Admins only.

### POST

```
http://.../products/
```
Creates a product and stores it in the data base. Can only be done by authenticated users.
```
http://.../orders/
```
Creates an order and stores it in the data base. Can only be done by authenticated users.
```
http://.../users/signup/
```
Creates a user, hashes some of their data and stores it.
```
http://.../users/login/
```
Users are provided with a token which is used for authentication on protected routes.

### PATCH

```
http://.../products/{product_id}
```
Updates the product which matches the id provided. Can only be done by users who listed the product.

### DELETE

```
http://.../products/{product_id}
```
Users who listed products can also delete them.
```
http://.../orders/{order_id}
```
Users who made orders can also delete them.
