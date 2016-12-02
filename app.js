//NPM Packages - Variables - Setup
var express = require('express'),
  request = require('request'),
  app = express(),
  pgp = require('pg-promise')(),
  mustache = require('mustache-express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  PORT = process.env.PORT || 9000,
  fetch = require('node-fetch'),
  db = pgp(process.env.DATABASE_URL || 'postgres://student_13@localhost:5432/fitness_db'),
  bcrypt = require('bcrypt'),
  session = require('express-session'),
  API_KEY = process.env.API_KEY,
  API_ID = process.env.API_ID;


app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use('/', express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());
app.listen(PORT, function() {
  console.log('APP IS ALIVE ON:', PORT);
});

// User login session set up
app.use(session({
  secret: 'ExperFitness',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}))

app.get('/login', function(req, res) {
  var logged_in,
    email,
    userName,
    id;

  if (req.session.user) {
    logged_in = true;
    email = req.session.user.email;
    userName = req.session.user.user_name;
    id = req.session.user.id;
  };

  var data = {
    'logged_in': logged_in,
    'email': email,
    'userName': userName,
    'id': id
  }
  res.render('login', data);
});

//Initial API call
app.get('/api', function(req, res) {
  var food = req.query.value
  var api = 'https://api.nutritionix.com/v1_1/search/' + food + '?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat&appId=' + API_ID + '&appKey=' + API_KEY;
  request.get({
    url: api,
    json: true,
  }, function(err, resp, data) {
    res.json(data);
  })
})

app.get('/', function(req, res) {
  res.render('index');
})

app.get('/workout', function(req, res) {
  db.many('SELECT * FROM upperbody ; SELECT * FROM lowerbody').then(function(data) {
    res.render('workout', {
      data: data
    });
  });
});

app.get('/meal', function(req, res) {
  res.render('meal');
});


app.post('/meal', function(req, res) {
  meal = req.body;
  db.none('INSERT INTO meals (food_name, calories) VALUES ($1,$2)'
    , [meal.mealTest, meal.calories]).then(function(data) {
    res.render('plan');
  })
});

app.delete('/plan/:id', function(req, res) {
  id = req.params.id
  db.none('DELETE FROM meals WHERE id= $1', [id]).then(function() {
    res.send('meal removed');
  })
});

app.get('/plan', function(req, res) {
  data = req.body;
  db.many('SELECT * FROM meals').then(function(data) {
    res.render('plan', {
      data: data
    });
  })
});

app.get('/signup', function(req, res) {
  res.render('signup');
});

app.post('/signup', function(req, res) {
  var data = req.body;
  bcrypt.hash(data.password, 10, function(err, hash) {
    db.none('INSERT INTO users (user_name, email, password_digest) VALUES ($1, $2, $3)'
      , [data.user_name, data.email, hash]).then(function() {
      res.send("Your account was created!");
    })
  })
  console.log(data);
})

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  var data = req.body;
  db.one('SELECT * FROM users WHERE email = $1', [data.email]).catch(function(user) {
    res.send('User account not found. Check Login information.');
  }).then(function(user) {
    bcrypt.compare(data.password, user.password_digest, function(err, cmp) {
      if (cmp) {
        req.session.user = user;
        res.redirect('/login');
      } else {
        res.send("User account not found. Check Login information.")
      }
    })
  })
})

app.put('/userupdate/:id', function(req, res) {
  var id = req.params.id;
  var user = req.body;
  console.log(user.username);
  console.log(id);
  db.none('UPDATE users SET user_name = $1 WHERE id = $2', [user.username, id]).then(function() {
    db.one('SELECT * FROM users WHERE id=$1', [id]).then(function(user) {
      req.session.user = user;
      res.redirect('/login');
    })
  })
})

app.get('/logout', function(req, res) {
  req.session.user = null;
  res.redirect('login');
})
