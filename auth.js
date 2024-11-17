function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Ensure user is an admin
function isAdmin(req, res, next) {
    if (req.user.role === 'admin') {
        return next();
    }
    res.redirect('/');
}

// Ensure user is an admin or editor
function isEditor(req, res, next) {
    if (req.user.role === 'admin' || req.user.role === 'editor') {
        return next();
    }
    res.redirect('/');
}

module.exports = { ensureAuthenticated, isAdmin, isEditor };
