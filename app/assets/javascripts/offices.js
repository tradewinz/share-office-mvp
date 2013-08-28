function iePlaceholderFix() {
    var input = document.createElement("input");
    if(('placeholder' in input)==false) {
        $('[placeholder]').focus(function() {
            var i = $(this);
            if(i.val() == i.attr('placeholder')) {
                i.val('').removeClass('placeholder');
                if(i.hasClass('password')) {
                    i.removeClass('password');
                    this.type='password';
                }
            }
        }).blur(function() {
                var i = $(this);
                if(i.val() == '' || i.val() == i.attr('placeholder')) {
                    if(this.type=='password') {
                        i.addClass('password');
                        this.type='text';
                    }
                    i.addClass('placeholder').val(i.attr('placeholder'));
                }
            }).blur().parents('form').submit(function() {
                $(this).find('[placeholder]').each(function() {
                    var i = $(this);
                    if(i.val() == i.attr('placeholder'))
                        i.val('');
                })
            });
    }
}

//Finds y value of given object
function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    return [curtop];
    }
}

function addressAutocompleteOffice() {
        var input = document.getElementById('address_field');
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.setTypes(['geocode']);
        autocomplete.setComponentRestrictions({'country':'us'});
        iePlaceholderFix();

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            var place = autocomplete.getPlace();
            if (place.address_components) {
                var street = document.getElementById('street');
                var city = document.getElementById('city');
                var state = document.getElementById('state');
                var zip = document.getElementById('zip');

                // reset fields
                street.value = '';
                city.value = '';
                state.value = '';
                zip.value = '';


                //street.value = place.address_components[0] && place.address_components[0].short_name || '';
                //city.value = place.address_components[1] && place.address_components[1].short_name || '';
                //state.value = place.address_components[2] && place.address_components[2].short_name || '';
                var street_number;
                var street_name;

                for (var i=0; i<place.address_components.length;i++)
                {
                    for (var j=0;j<place.address_components[i].types.length;j++)
                    {
                        //console.log('type:' + place.address_components[i].types[j] + ' => short_name:' + place.address_components[i].short_name + ' , long_name:' + place.address_components[i].long_name);
                        if (place.address_components[i].types[j] == "postal_code")
                        {
                            zip.value = place.address_components[i].long_name;
                        }
                        else if (place.address_components[i].types[j] == "street_number")
                        {
                            street_number = place.address_components[i].long_name;
                        }
                        else if (place.address_components[i].types[j] == "route")
                        {
                            street_name = place.address_components[i].long_name;
                        }
                        else if (place.address_components[i].types[j] == "locality")
                        {
                            city.value = place.address_components[i].long_name;
                        }
                        else if (place.address_components[i].types[j] == "administrative_area_level_1")
                        {
                            state.value = place.address_components[i].short_name;
                        }
                    }
                }
                if (street_number && street_name) {
                    street.value = street_number + ' ' + street_name;
                } else if (street_name) {
                    street.value = street_name;
                } else {
                    street.value = '';
                }
            }

            if (city.value == '' || street.value == '' ) {
                $("#address_field").addClass('error-border');
                $("#error-msg").show();
            } else {
                correctInput = input.value;
                $("#address_field").removeClass('error-border');
                $("#error-msg").hide();
            }


            console.log(input.value);
            console.log(street.value);
            console.log(city.value);
            console.log(state.value);
            console.log(zip.value);
        });
        // // get latitude and longitude
        //   geocoder.geocode( { 'address': place}, function(results, status) {
        //     if (status == google.maps.GeocoderStatus.OK) {
        //       map.setCenter(results[0].geometry.location);
        //       var marker = new google.maps.Marker({
        //           map: map,
        //           position: results[0].geometry.location
        //       });
        //     } else {
        //       alert('Geocode was not successful for the following reason: ' + status);
        //     }
        //   });
}