// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Permission denied. Admins only.');
};

// Middleware to check if the user is an editor or admin
const isEditor = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'editor')) {
        return next();
    }
    res.status(403).send('Permission denied. Editors and Admins only.');
};

module.exports = { isAdmin, isEditor };
