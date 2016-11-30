$(document).ready(function() {

var getData = function(food){
$.ajax({
  url: '/api',
  method: 'GET'
  // data: {value: food},
  // dataType: 'json'
})
.done(function(data) {
  console.log(data);
  appendDom(data);
});
}

$('.button-primary').click(function(event) {
var value = $(' #meal ').val();
console.log(value);
getData(value);
});

function appendDom(data){
    $(' #test ').append('<h5>' + data.hits[0].fields.item_name + ' | Calories: ' + data.hits[0].fields.nf_calories + '</h5>');
}

});
