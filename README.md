# 🚗 Automotive Parts Store

A Full Stack Automotive Parts Store Web Application developed using Node.js, Express.js, MySQL, HTML, CSS, JavaScript, and Bootstrap. The system allows customers to browse automotive products, manage carts and wishlists, place orders, track deliveries, and enables administrators to manage products, categories, customers, and orders through a dedicated dashboard.

---

## 📌 Project Description

The Automotive Parts Store is an e-commerce web application designed for selling automobile spare parts for both cars and motorcycles. Customers can browse products, search and filter items, add them to the cart or wishlist, place orders, make payments, and track deliveries. Administrators can manage products, categories, customers, and orders through an admin dashboard.

---

## ✨ Features

### Customer Module

- User Registration & Login
- Secure Password Encryption
- Browse Products
- Product Search
- Brand & Category Filter
- Wishlist
- Shopping Cart
- Quantity Update
- Address Management
- Payment Gateway UI
- Order Placement
- Order Tracking
- Order History
- User Profile

---

### Admin Module

- Admin Login
- Dashboard
- Product Management (CRUD)
- Category Management
- Customer Management
- Order Management
- Approve Orders
- Update Packing Status
- Update Shipping Status
- Update Delivery Status
- Cancel Orders
- Reports
- Notifications
- Store Settings

---

## 🛠 Technologies Used

### Frontend

- HTML5
- CSS3
- Bootstrap 5
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- MySQL

### Authentication

- Express Session
- bcryptjs

---

## 📂 Project Structure

```
Automotive-Parts-Store
│
├── database/
├── middleware/
├── public/
│   ├── css/
│   ├── images/
│   ├── js/
│   └── videos/
│
├── routes/
├── uploads/
├── views/
├── app.js
├── package.json
├── package-lock.json
└── README.md
```
## 🏗 System Architecture

```
                    +----------------------+
                    |      Customer        |
                    +----------+-----------+
                               |
                               |
                               v
                    +----------------------+
                    |   Frontend (HTML,    |
                    | CSS, Bootstrap, JS)  |
                    +----------+-----------+
                               |
                      HTTP Requests
                               |
                               v
                    +----------------------+
                    | Express.js Routes    |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | Controllers / Logic  |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    | MySQL Database       |
                    +----------------------+
                               ^
                               |
                    +----------+-----------+
                    | Admin Dashboard      |
                    +----------------------+
```
## 🏛 MVC Architecture

```
               User Request
                     |
                     v
             Express Router
                     |
        --------------------------
        |                        |
        v                        |
     Controller                  |
(Business Logic)                 |
        |                        |
        v                        |
      MySQL Database             |
        |                        |
        v                        |
     Controller                  |
        |                        |
        v                        |
       Views (HTML)  <------------
                     |
                     v
               User Browser
```

### Model

- MySQL Database
- Stores products, users, orders, wishlist, cart, categories, brands and models.

### View

- HTML
- CSS
- Bootstrap
- JavaScript

### Controller

- Express.js Routes
- Business Logic
- Database Queries
- Authentication
## 🗄 Entity Relationship Diagram (ER Diagram)

```
             USERS
------------------------------
id (PK)
name
email
password
role
phone
address
        |
        |
        | 1
        |
        | M
        |
------------------------------
             ORDERS
------------------------------
id (PK)
user_id (FK)
total_amount
status
created_at
        |
        |
        | 1
        |
        | M
        |
------------------------------
          ORDER_ITEMS
------------------------------
id (PK)
order_id (FK)
product_id (FK)
quantity
price
        |
        |
        | M
        |
        | 1
        |
------------------------------
            PRODUCTS
------------------------------
id (PK)
category_id (FK)
brand_id (FK)
model_id (FK)
name
price
stock
discount
image
vehicle_type
        |
        |
        |
        |
------------------------------
          CATEGORIES
------------------------------
id (PK)
name

------------------------------
            BRANDS
------------------------------
id (PK)
name

------------------------------
            MODELS
------------------------------
id (PK)
brand_id (FK)
name

------------------------------
            CART
------------------------------
id (PK)
user_id (FK)
product_id (FK)
quantity

------------------------------
          WISHLIST
------------------------------
id (PK)
user_id (FK)
product_id (FK)
```
## 🔄 Customer Workflow

```
Register
    │
    ▼
Login
    │
    ▼
Browse Products
    │
    ▼
Search / Filter Products
    │
    ▼
View Product Details
    │
    ▼
Add to Cart / Wishlist
    │
    ▼
Checkout
    │
    ▼
Enter Delivery Address
    │
    ▼
Choose Payment Method
    │
    ▼
Place Order
    │
    ▼
Admin Approval
    │
    ▼
Packing
    │
    ▼
Shipping
    │
    ▼
Delivered
```
## 👨‍💼 Admin Workflow

```
Admin Login
      │
      ▼
Dashboard
      │
      ├────────► Manage Products
      │
      ├────────► Manage Categories
      │
      ├────────► Manage Customers
      │
      ├────────► View Orders
      │
      ├────────► Approve Orders
      │
      ├────────► Update Status
      │
      ├────────► Reports
      │
      └────────► Settings
```
## 📂 Folder Structure

```
Automotive-Parts-Store
│
├── database
│     automotive_store.sql
│
├── middleware
│     authMiddleware.js
│
├── public
│     ├── css
│     ├── images
│     ├── js
│     └── videos
│
├── routes
│     authRoutes.js
│     adminRoutes.js
│     cartRoutes.js
│     orderRoutes.js
│     productRoutes.js
│     wishlistRoutes.js
│
├── uploads
│
├── views
│     login.html
│     register.html
│     home.html
│     products.html
│     cart.html
│     wishlist.html
│     payment.html
│     tracking.html
│     admin-dashboard.html
│
├── app.js
├── package.json
├── package-lock.json
└── README.md
```
## 🔁 Application Flow

```
Client
   │
   ▼
HTML / CSS / JavaScript
   │
HTTP Request
   │
   ▼
Express.js Router
   │
   ▼
Middleware
(Authentication)
   │
   ▼
Business Logic
   │
   ▼
MySQL Database
   │
   ▼
Response
   │
   ▼
Browser
```
## 🛡 Authentication Flow

```
User Login
     │
     ▼
Validate Credentials
     │
     ▼
Password Verification
(bcrypt)
     │
     ▼
Create Session
     │
     ▼
Access Protected Pages
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/polagonitejagoud/Automotive-Parts-Store.git
```

### Move to Project

```bash
cd Automotive-Parts-Store
```

### Install Packages

```bash
npm install
```

### Import Database

Import the `automotive_store.sql` file into MySQL.

### Start Server

```bash
node app.js
```

Server runs on:

```
http://localhost:3000
```

---

## 📷 Screenshots

- Login Page
- Register Page
- Home Page
- Products Page
- Product Details
- Cart
- Wishlist
- Payment
- Order Tracking
- Admin Dashboard
- Reports

---

## 🔒 Security Features

- Password Hashing using bcrypt
- Session-based Authentication
- Role-based Access Control
- Protected Admin Routes

---

## 👨‍💻 Developed By

**Polagoni Teja**

B.Tech Student | Full Stack Web Developer

**Project:** Automotive Parts Store – Internship Project

---

## 📄 License

This project is developed for educational and internship purposes.
