function searchAutocomplete() {
	var input = document.getElementById('city');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setTypes(['geocode']);
    autocomplete.setComponentRestrictions({'country':'us'});
    //google.maps.event.addListener(autocomplete, 'place_changed', function() {    //
    //      $("#searchBtn").click();
    //});
}

function alertAutocomplete() {
  var inputA = document.getElementById('alertCity');
  var autocompleteA = new google.maps.places.Autocomplete(inputA);
  autocompleteA.setTypes(['geocode']);
  autocompleteA.setComponentRestrictions({'country':'us'});

  google.maps.event.addListener(autocompleteA, 'place_changed', function() {
    var place = autocompleteA.getPlace();
    console.log("Event::Place_Changed::" +place);
    if (place.address_components) {
      var city = document.getElementById('alert_loc_city');
      var state = document.getElementById('alert_loc_state');

      for (var i=0; i<place.address_components.length;i++)
      {
        for (var j=0;j<place.address_components[i].types.length;j++)
        {
          console.log('type:' + place.address_components[i].types[j] + ' => short_name:' + place.address_components[i].short_name + ' , long_name:' + place.address_components[i].long_name);
          if (place.address_components[i].types[j] == "locality")
          {
              city.value = place.address_components[i].long_name;
          }
          else if (place.address_components[i].types[j] == "administrative_area_level_1")
          {
              state.value = place.address_components[i].short_name;
          }
        }
      }
    }

    if (city.value == '') {
        alert("Please enter a valid address or city.");
    }
  });
}