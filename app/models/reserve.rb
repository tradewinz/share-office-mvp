class Reserve < ActiveRecord::Base
 	attr_accessible :name, :office_id, :email, :length, :misc, :phone
 	#belongs_to :office

	validates :name, 
			:presence => true

	validates :email,
			:format => { :with => /\b[A-Z0-9._%a-z\-]+@(?:[A-Z0-9a-z\-]+\.)+[A-Za-z]{2,4}\z/ }

	validates :office_id,
			:numericality => { :greater_than_or_equal_to => 0 }

end
