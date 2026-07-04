const express = require("express");
const db = require("../database/db");

const router = express.Router();

// Checkout
router.get("/checkout", (req, res) => {

    console.log("Checkout User:", req.session.user);

    if(!req.session.user){
        return res.send("Please Login");
    }

    const userId = req.session.user.id;

    console.log("Checkout User ID:", userId);
    
    const cartSql = `
    SELECT
        cart.product_id,
        cart.quantity,
        products.price,
        products.discount
    FROM cart
    JOIN products
    ON cart.product_id = products.id
    WHERE cart.user_id = ?
`;

    db.query(cartSql, [userId], (err, cartItems) => {

        if (err) return res.send(err);

        if (cartItems.length === 0) {
            return res.send("Cart is Empty");
        }

        let total = 0;

cartItems.forEach(item => {

    const discount =
        Number(item.discount || 0);

    const discountedPrice =
        item.price -
        (item.price * discount / 100);

    total += discountedPrice * item.quantity;

});

        db.query(
            "INSERT INTO orders(user_id,total_amount,status) VALUES(?,?,?)",
            [userId, total, "Pending"],
            (err, orderResult) => {

                if (err) return res.send(err);

                const orderId = orderResult.insertId;

                let values = [];

                cartItems.forEach(item => {
                    const discount =
    Number(item.discount || 0);

const discountedPrice =
    item.price -
    (item.price * discount / 100);

values.push([
    orderId,
    item.product_id,
    item.quantity,
    discountedPrice
]);
                });

                db.query(
                    `INSERT INTO order_items
                    (order_id,product_id,quantity,price)
                    VALUES ?`,
                    [values],
                    (err, result) => {

                        if (err) return res.send(err);

                        db.query(
                            "DELETE FROM cart WHERE user_id=?",
                            [userId],
                            (err) => {

                                if (err) return res.send(err);

                                res.json({

    success:true,

    orderId:orderId

});
                            }
                        );
                    }
                );
            }
        );
    });
});

// view Orders
router.get("/", (req, res) => {

    console.log("Session User:", req.session.user);

    if(!req.session.user){
        return res.send("Please Login");
    }

    const userId = req.session.user.id;

    console.log("User ID:", userId);

    db.query(
        "SELECT * FROM orders WHERE user_id=?",
        [userId],
        (err, results) => {

            console.log("Orders Found:", results);

            if(err){
                return res.send(err);
            }

            res.json(results);
        }
    );

});

// Get Single Order

router.get("/:id", (req, res) => {

    if(!req.session.user){
        return res.send("Please Login");
    }

    db.query(

        "SELECT * FROM orders WHERE id=?",

        [req.params.id],

        (err, results) => {

            if(err){
                return res.send(err);
            }

            res.json(results[0]);

        }

    );

});

module.exports = router;