const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');

app.use(cookieParser());

app.set('view engine', 'ejs');
app.use('/views', express.static('views'))
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Use route files
app.use('/', authRoutes);

app.use('/', blogRoutes);


app.listen(process.env.PORT, function(){
    console.log('Successful');
})
