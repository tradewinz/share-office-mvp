Geocoder.configure(
    # open source free geocode service - slow
    :lookup => :nominatim,
    # nominatim is slow , so add more time so geocder doesn;t timeout
    :timeout => 10

    # Using Google free account  restricted to 2500/day
    #:lookup => :google

    # Google premier geocoding service
    #:lookup => :google_premier,

    # intuit enterprise license, must be on intuit.com domain but we don;t ahve the key !
    #:api_key => ["???", "gme-intuitinc", "fms.spaces"]
)