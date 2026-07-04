
const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const path = require("path");
const rateLimit = require("express-rate-limit");

const isLoggedIn =
require("./middleware/authMiddleware");

const app = express();
app.use(helmet());
const limiter = rateLimit({

windowMs:15*60*1000,

max:100,

message:"Too many requests. Please try again later."

});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({

secret:"automotive_store",

resave:false,

saveUninitialized:false,

cookie:{

httpOnly:true,

maxAge:1000*60*60,

sameSite:"strict"

}

}));

const authRoutes = require("./routes/authRoutes");

app.use("/auth", authRoutes);

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.static("public"));

app.use("/products", require("./routes/productRoutes"));
app.use("/cart", require("./routes/cartRoutes"));
app.use("/wishlist", require("./routes/wishlistRoutes"));
app.use("/orders", require("./routes/orderRoutes"));
app.use("/admin", require("./routes/adminRoutes"));

/* Session User API */

app.get("/session-user", (req, res) => {

    if(req.session.user){

        res.json({
            loggedIn: true,
            id: req.session.user.id,
            name: req.session.user.name,
            role: req.session.user.role
        });

    }else{

        res.json({
            loggedIn: false
        });

    }

});

/* Pages */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get("/home-page", isLoggedIn, (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "views",
            "home.html"
        )
    );

});

app.get("/products-page", isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "products.html"));
});

app.get("/product-page/:id", isLoggedIn, (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "views",
             "product-details.html"
        )
    );

});

app.get("/cart-page", isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "cart.html"));
});

app.get("/orders-page", isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "orders.html"));
});

app.get("/address-page", isLoggedIn, (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "views",
            "address.html"
        )
    );

});

app.get("/wishlist-page", isLoggedIn, (req, res) => {

    res.sendFile(
        path.join(__dirname, "views", "wishlist.html")
    );

});

app.get("/profile-page", isLoggedIn, (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "views",
            "profile.html"
        )
    );

});

app.get("/admin-dashboard", isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "admin-dashboard.html"));
});

app.get("/add-product", isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "add-product.html"));
});

app.get("/customers-page", isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "customers.html"));
});

app.get("/admin-orders", isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "admin-orders.html"));
});

app.get("/edit-product/:id", isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "edit-product.html"));
});

app.get("/categories-page", isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "categories.html"));
});

app.get("/reports-page", isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "reports.html"));
});

app.get("/notifications-page", isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "notifications.html"));
});

app.get("/settings-page", isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, "views", "settings.html"));
});

app.get("/tracking-page", isLoggedIn, (req, res) => {

    res.sendFile(
        path.join(__dirname, "views", "tracking.html")
    );

});

/* Logout */

app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/login");

    });

});

app.get("/payment-page", isLoggedIn, (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "views",
            "payment.html"
        )
    );

});

app.get("/tracking-page", isLoggedIn, (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "views",
            "tracking.html"
        )
    );

});

app.get("/order-confirmed-page", isLoggedIn, (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "views",
            "order-confirmed.html"
        )
    );

});





app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});

