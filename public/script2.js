$(document).ready(function() {

var getData = function(item){
$.ajax({
  url: 'https://api.nutritionix.com/v1_1/search/'+ item +'?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat&appId=aafd4a72&appKey=12bbc6910f666b1d13fb2e0262b41582',
  method: 'GET'
})
.done(function(data) {
  console.log(data);
  appendDom(data);
});
}

$('.button-primary').click(function(event) {
var value = $(' #meal').val();
console.log(value);
getData(value);
});

function appendDom(data){
    $(' h4 ').append('<h5>' + data.hits[0].fields.item_name + data.hits[0].fields.nf_calories + '</h5>');
}

});
