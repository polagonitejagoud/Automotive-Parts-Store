function isAdmin(req, res, next) {

    // Check if user is logged in
    if (!req.session.user) {
        return res.redirect("/login");
    }

    // Check if user is admin
    if (req.session.user.role !== "admin") {
        return res.status(403).send("Access Denied");
    }

    next();
}

module.exports = isAdmin;