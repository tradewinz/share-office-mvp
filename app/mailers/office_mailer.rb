class OfficeMailer < ActionMailer::Base
  self.default :from => 'Intuit Spaces <spaces@intuit.com>'

  def add_listing_confirm(office)
  	@office = office
  	mail(:to => office.user.email, :subject => "Your listing was successfully posted")
  end

  def edit_listing_confirm(office)
    @office = office
    mail(:to => office.user.email, :subject => "Your listing was updated successfully")
  end

  def reserve_listing_confirm(office, current_user)
    @office = office
    @current_user = current_user
    mail(:to => office.user.email, :subject => "Someone wants to rent your space!")
  end

  def request_reserve_confirm(office, current_user)
    @office = office
    @current_user = current_user
    mail(:to => current_user.email, :subject => "Your request to contact the host has been sent")
  end
end
