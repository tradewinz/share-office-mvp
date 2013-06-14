class Office < ActiveRecord::Base
  attr_accessible :office_type, :accomodate, :size, :wifi, :confroom, :kitchen, :parking, :ac, :printer,
                  :loc_zip, :loc_addr1, :loc_addr2, :loc_city, :loc_state,
                  :title, :description, :rent, :rent_type, :available,
                  :user_id, :latitude, :longitude, :gmaps, :window

  belongs_to :user                  

  validates :title, :presence => true
  validates :loc_zip, :presence => true

  #geocode using geocoder
  geocoded_by :loc_zip
  #already geocoded by gmap4rails below
  #after_validation :geocode

  # attachinary
  has_attachments :office_images, maximum: 4, accept: [:jpg, :png, :gif, :jpeg]


  # will_paginate resutls per page
  self.per_page = 20

  # make objects shows up in gmaps4rails
  acts_as_gmappable

  #describe how to retrieve the address from your model, if you use directly a db column, you can dry your code, see wiki
  def gmaps4rails_address
    "#{self.loc_zip}, #{self.loc_addr1}, #{self.loc_city}, #{self.loc_state}"
  end
end
