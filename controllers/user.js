const Model = require('../model/user');

// --------------------- SIGNUP ---------------------
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body.user;
    const confirmPass = req.body.confirmPass;

    // 1️⃣ Check if user already exists
    const existingUser = await Model.findOne({ username: username });
    if (existingUser) {
      console.log("Already have an account. Please go to login page");
      const popup = { duplicateUser: true };
      return res.render('signup', { popup: popup, newuser: req.body.user });
    }

    // 2️⃣ Check if passwords match
    if (password !== confirmPass) {
      console.log("Passwords do not match");
      const popup = { confPass: true };
      return res.render('signup', { popup: popup });
    }

    // 3️⃣ Create new user
    const newUser = await Model.create(req.body.user);
    console.log('Successful');
    res.redirect('/login');

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send('Server error');
  }
};

// --------------------- SIGNIN ---------------------
exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Find user
    const user = await Model.findOne({ username: username });
    if (!user) {
      console.log('No Such User');
      const popup1 = { incorrectuser: true };
      return res.render('login', { popup1: popup1 });
    }

    // 2️⃣ Check password
    if (user.authenticate(password)) {
      res.cookie('id', user._id, { expires: new Date(Date.now() + 1800000), httpOnly: true });
      res.cookie('firstname', user.firstname, { expires: new Date(Date.now() + 1800000), httpOnly: true });
      return res.redirect('/');
    } else {
      console.log('Incorrect Password');
      const popup1 = { incorrectpassword: true };
      return res.render('login', { popup1: popup1 });
    }

  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).send('Server error');
  }
};

// --------------------- SIGNOUT ---------------------
exports.signout = (req, res) => {
  res.clearCookie('id');
  res.clearCookie('firstname');
  res.redirect('/login');
};
