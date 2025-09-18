const Model = require('../model/blog');

// --------------------- Middleware: Require Signin ---------------------
exports.requireSignin = (req, res, next) => {
  if (!req.cookies.id) {
    return res.redirect('/login');
  }
  next();
};

// --------------------- Render Home ---------------------
exports.renderHome = async (req, res) => {
  try {
    const blogs = await Model.find({});
    // Add firstname from cookies to each blog if needed
    blogs.forEach(blog => blog.firstname = req.cookies.firstname);
    res.render('home', { blogs });
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
};

// --------------------- Create Blog ---------------------
exports.createBlog = async (req, res) => {
  if (!req.cookies.id) return res.redirect('/login');

  try {
    const blog = req.body.blog;
    blog.userId = req.cookies.id;
    await Model.create(blog);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// --------------------- Show Single Blog ---------------------
exports.showSingleBlog = async (req, res) => {
  try {
    const blogs = await Model.find({ _id: req.params.id });
    if (!blogs || blogs.length === 0) return res.redirect('/');

    blogs[0].firstname = req.cookies.firstname;
    blogs[0].isauthor = req.cookies.id == blogs[0].userId;
    res.render('show', { blogs });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

// --------------------- Show Your Blogs ---------------------
exports.showYourBlog = async (req, res) => {
  if (!req.cookies.id) return res.redirect('/login');

  try {
    const blogs = await Model.find({ userId: req.cookies.id });
    blogs.forEach(blog => blog.firstname = req.cookies.firstname);
    let firstname = req.cookies.firstname;
    res.render('showOwn', { blogs, firstname });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

// --------------------- Delete Post ---------------------
exports.deletePost = async (req, res) => {
  try {
    await Model.deleteOne({ _id: req.params.id });
    console.log('Deleted');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// --------------------- Update Blog: GET ---------------------
exports.updateBlogget = async (req, res) => {
  try {
    const blog = await Model.findOne({ _id: req.params.id });
    if (!blog) return res.redirect('/');
    
    blog.firstname = req.cookies.firstname;
    res.render('update', { blogs: blog });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};

// --------------------- Update Blog: POST ---------------------
exports.updateBlog = async (req, res) => {
  try {
    req.body.newblog.userId = req.cookies.id;
    const blog = await Model.findOneAndUpdate(
      { _id: req.params.id },
      req.body.newblog,
      { new: true } // return the updated document
    );
    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
