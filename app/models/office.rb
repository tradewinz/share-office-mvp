class Office < ActiveRecord::Base
  attr_accessible :availability, :company_name, :company_desc, :company_url, :contact_email, :contact_name, :contact_phone,
                  :contact_picture, :description, :image1, :image2, :image3, :image4, :insurance, :rent, :size, :swap,
                  :title, :years, :accomodate, :available, :loc_zip, :loc_addr1, :loc_addr2, :loc_city, :loc_state,
                  :features, :on_site
  validates(:title, presence: true)
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates(:contact_email, presence: true, format: { with: VALID_EMAIL_REGEX })
  mount_uploader :image1, ImageUploader
  mount_uploader :contact_picture, ImageUploader
end
