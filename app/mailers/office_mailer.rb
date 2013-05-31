class OfficeMailer < ActionMailer::Base
  self.default :from => 'Intuit Spaces <spaces@intuit.com>',
               :bcc => 'tradewinz@intuit.com',
               :reply_to => 'spaces@intuit.com'
  
  def add_listing_confirm(office)
  	@office = office
  	mail(:to => office.user.email, :subject => "Your listing was posted with Intuit Spaces")
  end

  def edit_listing_confirm(office)
    @office = office
    mail(:to => office.user.email, :subject => "Your listing was updated with Intuit Spaces")
  end

  def reserve_listing_confirm(office, current_user)
    @office = office
    @current_user = current_user
    mail(:to => office.user.email, :subject => "Someone just reserved your listing!")
  end
end
