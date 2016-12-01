$(document).ready(function() {

var getData = function(food){
$.ajax({
  url: '/api',
  method: 'GET',
  data: {value: food},
  dataType: 'json'
})
.done(function(data) {
  console.log(data);
  appendDom(data);
});
} // Ends ajax GET

$('.button-primary').click(function(event) {
var value = $(' #meal ').val();
console.log(value);
getData(value);
});

function appendDom(data){
    $(' #test ').append('<h5>' + data.hits[0].fields.item_name + ' | Calories: ' + data.hits[0].fields.nf_calories + '</h5>');

    // var body = $(' body '),
    //    mealContent = $('<div></div>'),
    //    form = $('<form class ="hidden-form" action="/plan" method+"POST"></form>'),
    //    button = $('<button class="save-button" type="submit">Save</button'),
    //    mealName = data.hits[0].fields.item_name,
    //    calNum = data.hits[0].fields.calories;

    //   body.append(mealContent);
    //   mealContent.append(form);
    //   mealContent.append('')
$(' #save-btn ').click(function(event) {

  var mealName = data.hits[0].fields.item_name;
  var calNum = data.hits[0].fields.nf_calories;
  // appendDom(mealName, calNum);

  var saveData = {
    mealTest : mealName,
    calories : calNum
  }
  console.log(saveData)

    $.ajax({
       url : '/workout',
       method : 'POST',
       data : saveData
      })// Ends ajax POST

    }

    );
  }

});// Ends doc.ready
