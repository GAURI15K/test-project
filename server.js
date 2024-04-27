const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://test:J6GRlPHNZPt3J40E@cluster0.nk3jcl2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/features', (req, res) => {
  res.render('features');
});

app.get('/services', (req, res) => {
  res.render('services');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
}); 

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send('Email already exists');
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error('Error saving user:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).send('Invalid email or password');
    }
    req.session.loggedIn = true;
    res.redirect('/');
  } catch (err) {
    console.error('Error finding user:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

