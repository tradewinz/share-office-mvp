class Reserve
 	include ActiveModel::Validations
	include ActiveModel::Conversion
	extend ActiveModel::Naming

	attr_accessor :name, :office_id, :email, :length, :misc, :phone

	validates :name, 
            :presence => true
  
  	validates :email,
            :format => { :with => /\b[A-Z0-9._%a-z\-]+@(?:[A-Z0-9a-z\-]+\.)+[A-Za-z]{2,4}\z/ }
  
  	validates :office_id,
		  	:numericality => { :greater_than_or_equal_to => 0 }

	def initialize(attributes = {}) 
		attributes.each do |name, value|
			send("#{name}=",value)
		end
	end

	def persisted?
		false
	end
end
