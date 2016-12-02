$(document).ready(function() {
  var getData = function(food) {
      $.ajax({
        url: '/api',
        method: 'GET',
        data: {
          value: food
        },

        dataType: 'json'
      }).done(function(data) {
        console.log(data);
        appendDom(data);
      });
    } // Ends ajax GET
  $('.button-primary').click(function(event) {
    var value = $(' #meal ').val();
    console.log(value);
    getData(value);
  });

  var appendDom = function(data) {
    $(' #test ').append('<h5>' + data.hits[0].fields.item_name + ' | Calories: ' + data.hits[0].fields.nf_calories + '</h5>');
    $(' #save-btn ').click(function(event) {
      var mealName = data.hits[0].fields.item_name;
      var calNum = data.hits[0].fields.nf_calories;
      // appendDom(mealName, calNum);
      var saveData = {
        mealTest: mealName,
        calories: calNum
      }

      console.log(saveData)
      $.ajax({
          url: '/meal',
          method: 'POST',
          data: saveData
        }) // Ends ajax POST
    }); //Ends click event
  } //Ends appendDom
}); // Ends doc.ready
