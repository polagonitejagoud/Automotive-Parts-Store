const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database/db");

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("Auth Route Working");
});


// Register
router.post("/register", async (req, res) => {

    const { name, email, password, role } = req.body;

    // Input Validation

if (!name || name.trim() === "") {
    return res.send("Name is required");
}

if (!email || email.trim() === "") {
    return res.send("Email is required");
}

const emailRegex =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
    return res.send("Invalid Email Address");
}

if (!password || password.length < 6) {
    return res.send("Password must contain at least 6 characters");
}

    try {

        const hashedPassword =
            await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)",
            [
                name,
                email,
                hashedPassword,
                role || "customer"
            ],
            (err, result) => {

                if(err){
                    console.log(err);
                    return res.send("Registration Failed");
                }

                res.redirect("/");
            }
        );

    } catch(error){

        console.log(error);
        res.send("Error");
    }

});

// Login
// Login
router.post("/login", (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
    return res.send("Email and Password are required");
}

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, results) => {

            if(err){
                return res.send(err);
            }

            if(results.length === 0){
                return res.send("User Not Found");
            }

            const user = results[0];

            const match = await bcrypt.compare(
                password,
                user.password
            );

            if(!match){
                return res.send("Invalid Password");
            }

            console.log("Login Attempt:", email);
            console.log("User Role:", user.role);

            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            req.session.save((err) => {

                if(err){
                    return res.send(err);
                }

                console.log("Login Success");
                console.log("User ID:", user.id);
                console.log("Email:", user.email);
                console.log("Role:", user.role);

                if(user.role === "admin"){

                    console.log("Redirecting to Admin Dashboard");

                    return res.redirect(
                        "/admin-dashboard"
                    );

                }else{

                    console.log("Redirecting to Products Page");

                    return res.redirect("/home-page");

                }

            });

        }
    );

});

// Get Profile
router.get("/profile", (req, res) => {

    if (!req.session.user) {
        return res.sendStatus(401);
    }

    db.query(
        "SELECT id,name,email,phone,address FROM users WHERE id=?",
        [req.session.user.id],
        (err, result) => {

            if (err) return res.send(err);

            res.json(result[0]);
        }
    );

});


// Update Profile
router.post("/profile/update", (req, res) => {

    if (!req.session.user) {
        return res.sendStatus(401);
    }

    const {
        name,
        email,
        phone,
        address
    } = req.body;

    db.query(

        `UPDATE users
        SET
        name=?,
        email=?,
        phone=?,
        address=?
        WHERE id=?`,

        [
            name,
            email,
            phone,
            address,
            req.session.user.id
        ],

        (err) => {

            if (err) return res.send(err);

            res.send("Profile Updated Successfully");

        }

    );

});

module.exports = router;
