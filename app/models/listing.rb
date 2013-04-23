class Listing < ActiveRecord::Base
  attr_accessible :description, :headline, :location, :image, :user_id

  belongs_to :user
  
  mount_uploader :image, ImageUploader

  validates :headline, :length => { :maximum => 140 }

  validates :description, :length => { :maximum => 255 }

end
