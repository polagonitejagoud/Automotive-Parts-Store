const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.use((req, res, next) => {

    if(!req.session.user){
        return res.redirect("/login");
    }

    if(req.session.user.role !== "admin"){
       return res.status(403).send("Access Denied");
    }

    next();

});

// Dashboard Statistics
router.get("/dashboard", (req, res) => {

    const stats = {};

    db.query(
        "SELECT COUNT(*) AS users FROM users",
        (err, userResult) => {

            stats.users = userResult[0].users;

            db.query(
                "SELECT COUNT(*) AS products FROM products",
                (err, productResult) => {

                    stats.products = productResult[0].products;

                    db.query(
                        "SELECT COUNT(*) AS orders FROM orders",
                        (err, orderResult) => {

                            stats.orders = orderResult[0].orders;

                            db.query(
                                "SELECT SUM(total_amount) AS revenue FROM orders",
                                (err, revenueResult) => {

                                    stats.revenue =
                                        revenueResult[0].revenue || 0;

                                    res.json(stats);
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});
//view all users
router.get("/users", (req, res) => {

    db.query(
        "SELECT id,name,email,role FROM users",
        (err, results) => {

            if(err){
                return res.send(err);
            }

            res.json(results);
        }
    );
});
//View All Orders
router.get("/orders", (req, res) => {

    db.query(
        `SELECT
            orders.id,
            users.name,
            orders.total_amount,
            orders.status,
            orders.created_at
         FROM orders
         JOIN users
         ON orders.user_id = users.id`,
        (err, results) => {

            if(err){
                return res.send(err);
            }

            res.json(results);
        }
    );
});

// Update Order Status
router.post("/order-status/:id", (req, res) => {

    const { status } = req.body;

    db.query(
        "UPDATE orders SET status=? WHERE id=?",
        [status, req.params.id],
        (err, result) => {

            if(err){
                return res.send(err);
            }

            res.send("Status Updated");
        }
    );
});

// ===============================
// Approve Order
// ===============================

router.put("/approve/:id", (req, res) => {

    db.query(
        "UPDATE orders SET status='Approved' WHERE id=?",
        [req.params.id],
        (err) => {

            if(err){
                return res.send(err);
            }

            res.send("Order Approved");

        }
    );

});

// ===============================
// Pack Order
// ===============================

router.put("/pack/:id", (req, res) => {

    db.query(
        "UPDATE orders SET status='Packed' WHERE id=?",
        [req.params.id],
        (err) => {

            if(err){
                return res.send(err);
            }

            res.send("Order Packed");

        }
    );

});

// ===============================
// Ship Order
// ===============================

router.put("/ship/:id", (req, res) => {

    db.query(
        "UPDATE orders SET status='Shipped' WHERE id=?",
        [req.params.id],
        (err) => {

            if(err){
                return res.send(err);
            }

            res.send("Order Shipped");

        }
    );

});

// ===============================
// Deliver Order
// ===============================

router.put("/deliver/:id", (req, res) => {

    db.query(
        "UPDATE orders SET status='Delivered' WHERE id=?",
        [req.params.id],
        (err) => {

            if(err){
                return res.send(err);
            }

            res.send("Order Delivered");

        }
    );

});

// ===============================
// Cancel Order
// ===============================

router.put("/cancel/:id", (req, res) => {

    db.query(
        "UPDATE orders SET status='Cancelled' WHERE id=?",
        [req.params.id],
        (err) => {

            if(err){
                return res.send(err);
            }

            res.send("Order Cancelled");

        }
    );

});

//View Categories
router.get("/categories", (req, res) => {

    db.query(
        "SELECT * FROM categories",
        (err, results) => {

            if(err){
                return res.send(err);
            }

            res.json(results);
        }
    );

});

//Add Category
router.post("/categories/add", (req, res) => {

    db.query(
        "INSERT INTO categories(name) VALUES(?)",
        [req.body.name],
        (err, result) => {

            if(err){
                return res.send(err);
            }

            res.send("Category Added");
        }
    );

});

//Delete Category
router.get("/categories/delete/:id", (req, res) => {

    db.query(
        "DELETE FROM categories WHERE id=?",
        [req.params.id],
        (err, result) => {

            if(err){
                return res.send(err);
            }

            res.send("Category Deleted");
        }
    );

});

// Edit Category
router.post("/categories/update/:id", (req, res) => {

    db.query(
        "UPDATE categories SET name=? WHERE id=?",
        [req.body.name, req.params.id],
        (err, result) => {

            if(err){
                return res.send(err);
            }

            res.send("Category Updated");
        }
    );
   
});
// Reports Data
router.get("/reports", (req, res) => {

    const report = {};

    db.query(
        "SELECT SUM(total_amount) AS revenue FROM orders",
        (err, revenueResult) => {

            report.revenue =
                revenueResult[0].revenue || 0;

            db.query(
                "SELECT COUNT(*) AS orders FROM orders",
                (err, orderResult) => {

                    report.orders =
                        orderResult[0].orders;

                    db.query(
                        "SELECT COUNT(*) AS customers FROM users",
                        (err, customerResult) => {

                            report.customers =
                                customerResult[0].customers;

                            db.query(
                                "SELECT COUNT(*) AS products FROM products",
                                (err, productResult) => {

                                    report.products =
                                        productResult[0].products;

                                    db.query(
                                        "SELECT * FROM products WHERE stock < 10",
                                        (err, lowStock) => {

                                            report.lowStock =
                                                lowStock;

                                            res.json(report);

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

});
// Notifications
router.get("/notifications", (req, res) => {

    const notifications = {};

    db.query(
        "SELECT * FROM products WHERE stock < 10",
        (err, lowStock) => {

            notifications.lowStock = lowStock;

            db.query(
                "SELECT * FROM orders WHERE status='Pending'",
                (err, pendingOrders) => {

                    notifications.pendingOrders =
                        pendingOrders.length;

                    db.query(
                        "SELECT * FROM orders WHERE status='Cancelled'",
                        (err, cancelledOrders) => {

                            notifications.cancelledOrders =
                                cancelledOrders.length;

                            res.json(notifications);

                        }
                    );

                }
            );

        }
    );

});
// Get Settings
router.get("/settings", (req, res) => {

    db.query(
        "SELECT * FROM settings LIMIT 1",
        (err, results) => {

            if (err) return res.send(err);

            res.json(results[0]);
        }
    );
});

// Save Settings
router.post("/settings", (req, res) => {

    const {
        store_name,
        email,
        phone,
        address
    } = req.body;

    db.query(
        `UPDATE settings
         SET store_name=?,
             email=?,
             phone=?,
             address=?
         WHERE id=1`,
        [
            store_name,
            email,
            phone,
            address
        ],
        (err, result) => {

            if (err) return res.send(err);

            res.send("Settings Saved Successfully");
        }
    );
});

module.exports = router;
