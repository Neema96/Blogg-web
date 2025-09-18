const express = require('express');
const router = express.Router();
const { requireSignin, renderHome, createBlog, showSingleBlog, showYourBlog, updateBlog, updateBlogget, deletePost } = require('../controllers/blog');

// Blog GET routes
router.get('/', requireSignin, renderHome);
router.get('/createBlog', requireSignin, function(req, res) {
    let blogs = { firstname: req.cookies.firstname };
    let firstname = req.cookies.firstname;
    res.render('createBlog', { blogs: blogs, firstname });
});
router.get('/blog/:id', showSingleBlog);
router.get('/showOwn', requireSignin, showYourBlog);
router.get('/blog/:id/update', requireSignin, updateBlogget);   

// Blog POST routes
router.post('/createBlog', requireSignin, createBlog);
router.post('/blog/:id/delete', requireSignin, deletePost);
router.post('/blog/:id/update', requireSignin, updateBlog);

module.exports = router;