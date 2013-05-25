class OfficeMailer < ActionMailer::Base
  default from: "Intuit Labs <tradewinz@intuit.com>"
  
  def add_listing_confirm(office)
  	@office = office
  	mail(:to => office.user.email, :subject => "Your listing was posted with Intuit Spaces")
    mail(:to => "spaces@intuit.com", :subject => "High-Five! Someone just added a listing @ Spaces")
  end

  def edit_listing_confirm(office)
    @office = office
    mail(:to => "spaces@intuit.com", :subject => "Someone just edited their listing")
  end

end
