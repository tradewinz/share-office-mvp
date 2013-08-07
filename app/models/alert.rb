class Alert < ActiveRecord::Base
  attr_accessible :city, :email, :misc

  validates :city, :presence => true
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, format: { with: VALID_EMAIL_REGEX }

  before_save { |alert| alert.city = alert.city.split.map(&:capitalize)*' ' }

end