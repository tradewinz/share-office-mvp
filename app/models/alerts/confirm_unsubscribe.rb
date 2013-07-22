class Alerts::ConfirmUnsubscribe
 	include ActiveModel::Validations
	include ActiveModel::Conversion
	extend ActiveModel::Naming

	attr_accessor :email

  	validates :email,
              correct_email

    def correct_email
    	if (self.email != @alert.email)
    	  errors.add(:email, "Email does not match email on record")
      end
    end
  
	def initialize(attributes = {}) 
		attributes.each do |name, value|
			send("#{name}=",value)
		end
	end

	def persisted?
		false
	end
end
