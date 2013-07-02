Geocoder.configure(
    # google free service
    :lookup => :nominatim
    # :lookup => :google

    # Google premier geocoding service
    :lookup => :google_premier,

    # Intuit enterprise license, must be on intuit.com domain [key, client, channel]
    :api_key => ["???", "gme-intuitinc", "fms.spaces"]
)