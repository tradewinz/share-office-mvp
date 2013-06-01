class OfficeMailer < ActionMailer::Base
  self.default :from => 'Intuit Spaces <spaces@intuit.com>'
               #:bcc => 'tradewinz@intuit.com'

  def add_listing_confirm(office)
  	@office = office
  	mail(:to => office.user.email, :subject => "Your listing was successfully posted at Intuit Spaces")
  end

  def edit_listing_confirm(office)
    @office = office
    mail(:to => office.user.email, :subject => "Your listing at Intuit Spaces was updated successfully")
  end

  def reserve_listing_confirm(office, current_user)
    @office = office
    @current_user = current_user
    mail(:to => office.user.email, :subject => "Someone just reserved your listing at Intuit Spaces!")
  end

  def request_reserve_confirm(office, current_user)
    @office = office
    @current_user = current_user
    mail(:to => current_user.email, :subject => "Thank you for booking a listing at Intuit Spaces!")
  end
end
