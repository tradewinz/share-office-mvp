class Office < ActiveRecord::Base
  attr_accessible :availability, :company_name, :company_desc, :company_url, :contact_email, :contact_name, :contact_phone,
                  :contact_picture, :description, :image1, :image2, :image3, :image4, :insurance, :rent, :size, :swap,
                  :title, :years, :accomodate, :available, :loc_zip, :loc_addr1, :loc_addr2, :loc_city, :loc_state,
                  :features, :on_site, :user_id, :latitude, :longitude

  belongs_to :user                  

  validates(:title, presence: true)
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates(:contact_email, presence: true, format: { with: VALID_EMAIL_REGEX })
  validates(:loc_zip, presence: true)

  geocoded_by :loc_zip
  after_validation :geocode

  acts_as_gmappable

  mount_uploader :image1, ImageUploader
  mount_uploader :contact_picture, ImageUploader

  def gmaps4rails_address
  #describe how to retrieve the address from your model, if you use directly a db column, you can dry your code, see wiki
    "#{self.loc_zip}, #{self.loc_city}, #{self.loc_state}"
  end
end
