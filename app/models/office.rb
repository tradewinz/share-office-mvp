class Office < ActiveRecord::Base
  attr_accessible :title, :description, :rent, :size,:image1, :image2, :image3, :image4,
                  :accomodate, :available, :loc_zip, :loc_addr1, :loc_addr2, :loc_city, :loc_state,
                  :user_id, :latitude, :longitude, :gmaps

  belongs_to :user                  

  validates(:title, presence: true)
  validates(:loc_zip, presence: true)

  #geocoded_by :loc_zip
  #after_validation :geocode

  acts_as_gmappable

  mount_uploader :image1, ImageUploader

  def gmaps4rails_address
  #describe how to retrieve the address from your model, if you use directly a db column, you can dry your code, see wiki
    "#{self.loc_zip}, #{self.loc_city}, #{self.loc_state}"
  end
end
