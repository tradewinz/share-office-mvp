Geocoder.configure(
    # open source free geocode service
    :lookup => :nominatim
    # DO NOT USE THE FREE GEOCODE SERVICE< YOU WILL GET OVER QUOTA SOON AT AMWS
    #:lookup => :google

    # Google premier geocoding service
    #:lookup => :google_premier,

    # Intuit enterprise license, must be on intuit.com domain [key, client, channel]
    #:api_key => ["???", "gme-intuitinc", "fms.spaces"]
)