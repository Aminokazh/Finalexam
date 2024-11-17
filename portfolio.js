const express = require('express');
const router = express.Router();
const PortfolioItem = require('../models/PortfolioItem');
const { ensureAuthenticated, isAdmin, isEditor } = require('../middleware/auth');

// GET /portfolio - Display all portfolio items (visible to all users)
router.get('/', async (req, res) => {
    try {
        // Retrieve portfolio items where 'deletedAt' is null
        const items = await PortfolioItem.find({ deletedAt: null }).populate('createdBy', 'username');
        res.render('portfolio/index', { items });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving portfolio items');
    }
});

// GET /portfolio/create - Render portfolio creation form (only admin and editor)
router.get('/create', ensureAuthenticated, isEditor, (req, res) => {
    res.render('portfolio/create');
});

// POST /portfolio/create - Handle portfolio item creation (admin and editor)
router.post('/create', ensureAuthenticated, isEditor, async (req, res) => {
    const { title, description, images } = req.body;

    if (!title || !description || !images) {
        return res.status(400).send('Title, description, and images are required.');
    }

    try {
        const newItem = new PortfolioItem({
            title,
            description,
            images: images.split(','),  // Assuming images are uploaded as a comma-separated string of URLs
            createdBy: req.user._id
        });

        await newItem.save();
        res.redirect('/portfolio');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating portfolio item');
    }
});

// GET /portfolio/edit/:id - Render portfolio edit form (only admin)
router.get('/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const item = await PortfolioItem.findById(req.params.id);
        if (!item) {
            return res.status(404).send('Portfolio item not found');
        }
        res.render('portfolio/edit', { item });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching portfolio item');
    }
});

// POST /portfolio/edit/:id - Handle portfolio item update (only admin)
router.post('/edit/:id', ensureAuthenticated, isAdmin, async (req, res) => {
    const { title, description, images } = req.body;

    if (!title || !description || !images) {
        return res.status(400).send('Title, description, and images are required.');
    }

    try {
        const updatedItem = await PortfolioItem.findByIdAndUpdate(req.params.id, {
            title,
            description,
            images: images.split(','),  // Split the string into an array
            updatedAt: Date.now()
        }, { new: true });

        if (!updatedItem) {
            return res.status(404).send('Portfolio item not found');
        }

        res.redirect('/portfolio');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating portfolio item');
    }
});

// DELETE /portfolio/delete/:id - Handle portfolio item deletion (only admin)
router.get('/delete/:id', ensureAuthenticated, isAdmin, async (req, res) => {
    try {
        const deletedItem = await PortfolioItem.findByIdAndUpdate(req.params.id, {
            deletedAt: Date.now()
        });

        if (!deletedItem) {
            return res.status(404).send('Portfolio item not found');
        }

        res.redirect('/portfolio');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting portfolio item');
    }
});

module.exports = router;
