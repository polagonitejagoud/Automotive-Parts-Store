
const express = require("express");
const db = require("../database/db");

const router = express.Router();

/* Add To Cart */

router.post("/add", (req, res) => {

    if(!req.session.user){
        return res.send("Please Login");
    }

    const user_id = req.session.user.id;
    const { product_id } = req.body;

    db.query(
        "SELECT * FROM cart WHERE user_id=? AND product_id=?",
        [user_id, product_id],
        (err, rows) => {

            if(err){
                return res.send(err);
            }

            if(rows.length > 0){

                db.query(
                    "UPDATE cart SET quantity = quantity + 1 WHERE id=?",
                    [rows[0].id],
                    (err) => {

                        if(err){
                            return res.send(err);
                        }

                        res.send("Quantity Updated");

                    }
                );

            }else{

                db.query(
                    "INSERT INTO cart(user_id,product_id,quantity) VALUES(?,?,1)",
                    [user_id, product_id],
                    (err) => {

                        if(err){
                            return res.send(err);
                        }

                        res.send("Added To Cart");

                    }
                );

            }

        }
    );

});

/* View Cart */

router.get("/", (req, res) => {

    if(!req.session.user){
        return res.json([]);
    }

    const user_id = req.session.user.id;

    const sql = `
    SELECT
    cart.id,
    products.name,
    products.price,
    products.discount,
    products.image,
    products.stock,
    cart.quantity
    FROM cart
    JOIN products
    ON cart.product_id = products.id
    WHERE cart.user_id = ?
`;

    db.query(
        sql,
        [user_id],
        (err, results) => {

            if(err){
                return res.send(err);
            }

            res.json(results);

        }
    );

});

/* Increase Quantity */

router.put("/increase/:id", (req, res) => {

    db.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE id=?",
        [req.params.id],
        (err) => {

            if(err){
                return res.send(err);
            }

            res.send("Quantity Increased");

        }
    );

});

/* Decrease Quantity */

router.put("/decrease/:id", (req, res) => {

    db.query(
        "UPDATE cart SET quantity = quantity - 1 WHERE id=? AND quantity > 1",
        [req.params.id],
        (err) => {

            if(err){
                return res.send(err);
            }

            res.send("Quantity Decreased");

        }
    );

});

/* Remove Item */

router.delete("/remove/:id", (req, res) => {

    db.query(
        "DELETE FROM cart WHERE id=?",
        [req.params.id],
        (err) => {

            if(err){
                return res.send(err);
            }

            res.send("Item Removed");

        }
    );

});

module.exports = router;
