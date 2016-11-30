var express = require('express'),
      request = require('request'),
      app = express(),
      pgp = require('pg-promise')(),
      mustache = require('mustache-express'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      PORT = process.env.PORT || 7000,
      fetch = require('node-fetch'),
      db = pgp (process.env.DATABASE_URL || 'postgres://student_13@localhost:5432/fitness_db'),
      API_KEY = process.env.API_KEY,
      API_ID = process.env.API_ID;



app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use('/', express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, function(){
 console.log('APP IS ALIVE ON:', PORT);
});

app.get('/', function(req, res){
  res.render('index');
});


//Initial API call
app.get('/api', function(req, res){
  var food = req.query.value;
  var api = 'https://api.nutritionix.com/v1_1/search/' +req.query.value+ '?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat&appId='+ API_ID + '&appKey=' + API_KEY;
  request.get({
    url: api,
    json : true,
  },function(err, resp, data){
    res.json(data);
    console.log(data);
  }
  )
})

app.get('/workout', function(req, res){
  db.many('SELECT * FROM upperbody ; SELECT * FROM lowerbody').then(function(data){
     res.render('workout', {
        data:data
     });
//console.log(data)
  });
});

app.get('/meal', function(req, res) {
  res.render('meal');
});

app.post('/workout', function(req, res) {
    meal = req.body
    db.none('INSERT INTO meals (food_name, calories) VALUES ($1,$2)',
    [meal.item_name, meal.nf_calories])
  res.render('workout');
});

app.delete('/meal', function(req, res) {
  id = req.params.id
  db.none('DELETE FROM meals WHERE id=$1', [id])
  res.send('meal removed');
});


app.get('/plan', function(req, res) {
  res.render('plan');
});

app.put('/plan', function(req, res) {
  // db.none('UPDATE meals')
  res.render('plan');
});




