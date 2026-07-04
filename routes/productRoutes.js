const express = require("express");
const multer = require("multer");
const db = require("../database/db");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// Add Product
router.post("/add", upload.single("image"), (req, res) => {

    const {
    category_id,
    brand_id,
    model_id,
    name,
    description,
    price,
    stock,
    vehicle_type
} = req.body;

    const image = req.file ? req.file.filename : null;

    const sql = `
    INSERT INTO products
    (
        category_id,
        brand_id,
        model_id,
        name,
        description,
        price,
        stock,
        image,
        vehicle_type
    )
    VALUES (?,?,?,?,?,?,?,?,?)
`;

    db.query(
        sql,
        [
    category_id,
    brand_id,
    model_id,
    name,
    description,
    price,
    stock,
    image,
    vehicle_type
],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send(err);
            }

            res.send("Product Added Successfully");
        }
    );
});

// View All Products
// ===============================
// View All Products
// ===============================

router.get("/", (req, res) => {

    const sql = `
        SELECT
            

    p.id,

    p.category_id,

    p.brand_id,

    p.model_id,

    p.name,

    p.description,

    p.price,

    p.discount,

    p.stock,

    p.image,

    p.vehicle_type,

    p.created_at,

    b.name AS brand_name,

    m.name AS model_name,

    c.name AS category_name

        FROM products p

        LEFT JOIN brands b
            ON p.brand_id = b.id

        LEFT JOIN models m
            ON p.model_id = m.id

        LEFT JOIN categories c
            ON p.category_id = c.id

        ORDER BY p.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.send(err);
        }

        res.json(results);

    });

});
        
// Search Products
router.get("/search/:keyword", (req, res) => {

    const keyword = `%${req.params.keyword}%`;

    db.query(
        "SELECT * FROM products WHERE name LIKE ?",
        [keyword],
        (err, results) => {

            if (err) {
                return res.send(err);
            }

            res.json(results);
        }
    );

});
// Vehicle filter
router.get("/vehicle/:type", (req, res) => {

    db.query(
        "SELECT * FROM products WHERE vehicle_type=?",
        [req.params.type],
        (err, results) => {
            if (err) return res.send(err);
            res.json(results);
        }
    );
});
//delete product
router.get("/delete/:id",(req,res)=>{

    db.query(
        "DELETE FROM products WHERE id=?",
        [req.params.id],
        (err,result)=>{

            if(err){
                return res.send(err);
            }

            res.send("Deleted");
        }
    );

});


// ===============================
// Get All Brands
// ===============================

router.get("/brands", (req, res) => {

    db.query(
        "SELECT * FROM brands ORDER BY name",
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(results);

        }
    );

});

// ===============================
// Get Models by Brand
// ===============================

router.get("/models/:brandId", (req, res) => {

    db.query(
        "SELECT * FROM models WHERE brand_id=? ORDER BY name",
        [req.params.brandId],
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(results);

        }
    );

});

// ===============================
// Get Categories
// ===============================

router.get("/categories", (req, res) => {

    db.query(
        "SELECT * FROM categories ORDER BY name",
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(results);

        }
    );

});
//best sellers
router.get("/best-sellers", (req, res) => {

    const sql = `
        SELECT
            products.*,
            COUNT(order_items.product_id) AS total_orders
        FROM order_items
        JOIN products
            ON products.id = order_items.product_id
        GROUP BY products.id
        ORDER BY total_orders DESC
        LIMIT 4
    `;

    db.query(sql, (err, result) => {

        if(err){
            return res.send(err);
        }

        res.json(result);

    });

});
// ===============================
// Get Single Product
// ===============================

router.get("/:id",(req,res)=>{

const sql=`

SELECT

p.*,

b.name AS brand_name,

m.name AS model_name,

c.name AS category_name

FROM products p

LEFT JOIN brands b
ON p.brand_id=b.id

LEFT JOIN models m
ON p.model_id=m.id

LEFT JOIN categories c
ON p.category_id=c.id

WHERE p.id=?

`;
    db.query(
        sql,
        [req.params.id],
        (err, results) => {

            if (err) {
                return res.send(err);
            }

            res.json(results[0]);

        }
    );

});


// Update Product
router.post(
"/update/:id",
upload.single("image"),
(req, res) => {

    const {
    category_id,
    brand_id,
    model_id,
    vehicle_type,
    name,
    description,
    price,
    stock
} = req.body;
const image =
req.file
? req.file.filename
: null;

    let sql;
let values;

if(image){

    sql = `
    UPDATE products
    SET
        category_id=?,
        brand_id=?,
        model_id=?,
        vehicle_type=?,
        name=?,
        description=?,
        price=?,
        stock=?,
        image=?
    WHERE id=?
    `;

    values = [
        category_id,
        brand_id,
        model_id,
        vehicle_type,
        name,
        description,
        price,
        stock,
        image,
        req.params.id
    ];

}else{

    sql = `
    UPDATE products
    SET
        category_id=?,
        brand_id=?,
        model_id=?,
        vehicle_type=?,
        name=?,
        description=?,
        price=?,
        stock=?
    WHERE id=?
    `;

    values = [
        category_id,
        brand_id,
        model_id,
        vehicle_type,
        name,
        description,
        price,
        stock,
        req.params.id
    ];

}

db.query(
    sql,
    values,
    (err, result) => {

        if(err){
            return res.send(err);
        }

        res.send("Product Updated Successfully");

    }
);

});
    
module.exports = router;