class Office < ActiveRecord::Base
  attr_accessible :office_type, :accomodate, :size, :wifi, :confroom, :kitchen, :parking, :ac, :printer,
                  :loc_zip, :loc_addr1, :loc_addr2, :loc_city, :loc_state,
                  :title, :description, :rent, :rent_type, :image1, :image2, :image3, :image4, :available,
                  :user_id, :latitude, :longitude, :gmaps, :remove_image1, :remove_image2, :remove_image3, :remove_image4, :window

  belongs_to :user                  

  validates :title, :presence => true
  validates :loc_zip, :presence => true

  #geocoded_by :loc_zip
  #after_validation :geocode

  acts_as_gmappable

  mount_uploader :image1, ImageUploader
  process_in_background :image1
  mount_uploader :image2, ImageUploader
  process_in_background :image2

  mount_uploader :image3, ImageUploader
  process_in_background :image3

  mount_uploader :image4, ImageUploader
  process_in_background :image4

  self.per_page = 20

  def gmaps4rails_address
  #describe how to retrieve the address from your model, if you use directly a db column, you can dry your code, see wiki
    "#{self.loc_zip}, #{self.loc_addr1}, #{self.loc_city}, #{self.loc_state}"
  end
end
