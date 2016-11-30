var express = require('express'),
      app = express(),
      pgp = require('pg-promise')(),
      mustache = require('mustache-express'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      PORT = process.env.PORT || 7070,
      fetch = require('node-fetch'),
      db = pgp (process.env.DATABASE_URL || 'postgres://student_13@localhost:5432/fitness_db');
//'+ item +'
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

// app.get('/', function(req, res){
//   fetch('https://api.nutritionix.com/v1_1/search/cheesecake?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat&appId=aafd4a72&appKey=12bbc6910f666b1d13fb2e0262b41582')
//   .then(function(data){
//     return data.json();
//   }).then(function(data){
//       res.render('index', {
//         data:data.hits[0].fields.item_name,
//         calories:data.hits[0].fields.nf_calories
//     });
//       console.log(data);
//   })
// });

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

app.post('/meal', function(req, res) {
  meal = req.body
  db.none('INSERT INTO meals (name, calories) VALUES ($1,$2)',
    [meal.item_name, meal.nf_calories])
    //res.render('meal');
  //meal = hits[0].fields
  //hits[0].fields.item_name, hits[0].fields.nf_calories
});

app.get('/plan', function(req, res) {
  res.render('plan');
});

app.put('/plan', function(req, res) {
  // db.none('UPDATE meals')
  res.render('plan')
});

app.delete('/plan', function(req, res) {
  id = req.params.id
  // db.none('DELETE FROM meals WHERE id=$1', [id])
  res.render('plan')
});



