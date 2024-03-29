class Office < ActiveRecord::Base
  attr_accessible :type_office, :accomodate, :size, :wifi, :confroom, :kitchen, :parking, :ac, :printer,
                  :loc_zip, :loc_addr1, :loc_addr2, :loc_city, :loc_state,
                  :title, :description, :rent, :available,
                  :user_id, :latitude, :longitude, :window, :featured,
                  :min_lease, :security, :cleaning, :active_flag

  belongs_to :user
  has_many :reserve, :dependent => :delete_all

  validates :loc_city, :presence => true
  validates :loc_addr1, :presence => true
  validates :active_flag, :presence => true

  validates :type_office, :presence => true
  validates :rent, :presence => true
  validates :min_lease, :presence => true

  #change to simple form before adding error
  #validates :accomodate, :numericality => { :greater_than_or_equal_to => 0 }


  #geocode using geocoder
  geocoded_by :address
  #geocode on update
  #after_validation :geocode

  # attachinary
  has_attachments :office_images, maximum: 20, accept: [:jpg, :png, :gif, :jpeg]


  # will_paginate query limit per page
  self.per_page = 24

  # make objects shows up in gmaps4rails
  #acts_as_gmappable :process_geocoding => false

  #describe how to retrieve the address from your model, if you use directly a db column, you can dry your code, see wiki
  #def gmaps4rails_address
  #  "#{self.loc_addr1}, #{self.loc_city}, #{self.loc_state}, #{self.loc_zip}"
  #end

  def address
    if !loc_addr1.blank? && !loc_zip.blank?
      [loc_addr1, loc_city, loc_state, loc_zip].compact.join(', ')
    elsif !loc_addr1.blank?
      [loc_addr1, loc_city, loc_state].compact.join(', ')
    elsif !loc_zip.blank?
      [loc_city, loc_state, loc_zip].compact.join(', ')
    else
      [loc_city, loc_state].compact.join(', ')
    end
  end

  def next(query)
    unless query.nil?
      index = query.find_index(self.id)
      next_id = query[index+1] unless index == query.size
      self.class.find_by_id(next_id)
    end
  end

  def previous(query)
    unless query.nil?
      index = query.find_index(self.id)
      prev_id = query[index-1] unless index.zero?
      self.class.find_by_id(prev_id)
    end
  end

end
