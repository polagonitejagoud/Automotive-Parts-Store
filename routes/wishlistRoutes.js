const express = require("express");
const db = require("../database/db");

const router = express.Router();

/* Add To Wishlist */

router.post("/add", (req, res) => {

    if(!req.session.user){
        return res.send("Please Login");
    }

    const userId = req.session.user.id;
    const { product_id } = req.body;

    db.query(
        "SELECT * FROM wishlist WHERE user_id=? AND product_id=?",
        [userId, product_id],
        (err, rows) => {

            if(err){
                return res.send(err);
            }

            if(rows.length > 0){
                return res.send("Already In Wishlist");
            }

            db.query(
                "INSERT INTO wishlist(user_id,product_id) VALUES(?,?)",
                [userId, product_id],
                (err, result) => {

                    if(err){
                        return res.send(err);
                    }

                    res.send("Added To Wishlist");

                }
            );

        }
    );

});

/* View Wishlist */

router.get("/", (req, res) => {

     console.log("Logged User:", req.session.user);
    if(!req.session.user){
        return res.json([]);
    }

    db.query(
        `SELECT
            wishlist.id AS wishlist_id,
            products.*
         FROM wishlist
         JOIN products
         ON wishlist.product_id = products.id
         WHERE wishlist.user_id = ?`,
        [req.session.user.id],
        (err, results) => {

            if(err){
                return res.send(err);
            }

            res.json(results);

        }
    );

});

/* Remove From Wishlist */

router.delete("/remove/:id", (req, res) => {

    db.query(
        "DELETE FROM wishlist WHERE id=?",
        [req.params.id],
        (err, result) => {

            if(err){
                return res.send(err);
            }

            res.send("Removed From Wishlist");

        }
    );

});

module.exports = router;